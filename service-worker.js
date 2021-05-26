/*
 * Samizdat Service Worker.
 *
 * Strategy (not fully implemented yet):
 *    1. Try to load from main website.
 *    2. If loading fails, load from Samizdat.
 *    3. If loading is too slow, load from Samizdat.
 *    4. If loaded content doesn't match authenticated versions, fall back to
 *       Samizdat.
 */

// initialize the SamizdatPlugins array
if (!Array.isArray(self.SamizdatPlugins)) {
    self.SamizdatPlugins = new Array()
}

// load the Gun+IPFS plugin, and idb-keyval
// order in which plugins are loaded defines the order
// in which they are called!
self.importScripts(
        "./plugins/fetch.js",
        "./plugins/cache.js");

console.log('(COMMIT_UNKNOWN) SamizdatPlugins.length:', self.SamizdatPlugins.length)

/**
 * fetch counter per clientId
 * 
 * we need to keep track of active fetches per clientId
 * so that we can inform a given clientId when we're completely done
 */
self.activeFetches = {}

/**
 * decrement fetches counter
 * and inform the correct clientId if all is finished done
 */
let decrementActiveFetches = (clientId) => {
    // decrement the fetch counter for the client
    self.activeFetches[clientId]--
    console.log('+-- activeFetches[' + clientId + ']:', self.activeFetches[clientId])
    if (self.activeFetches[clientId] === 0) {
        console.log('(COMMIT_UNKNOWN) All fetches done!')
        // inform the client
        // client has to be smart enough to know if that is just temporary
        // (and new fetches will fire in a moment, because a CSS file just
        //  got fetched) or not
        clients.get(clientId).then((client)=>{
            client.postMessage({
                allFetched: true
            })
        })
        .then(()=>{
            console.log('(COMMIT_UNKNOWN) all-fetched message sent.')
        })
    }
}

/* ========================================================================= *\
|* === SamizdatResourceInfo                                              === *|
\* ========================================================================= */


/**
 * Samizdat resource info class
 * 
 * keeps the values as long as the service worker is running,
 * and communicates all changes to relevant clients
 * 
 * clients are responsible for saving and keeping the values across
 * service worker restarts, if that's required
 */
let SamizdatResourceInfo = class {

    // actual values of the fields
    // only used internally, and stored into the Indexed DB
    values = {
        url: '', // read only after initialization
        clientId: null,
        fetchError: null,
        method: null,
        state: null, // can be "error", "success", "running"
        serviceWorker: 'COMMIT_UNKNOWN' // this will be replaced by commit sha in CI/CD; read-only
    }
    client = null;
    
    /**
     * constructor
     * needed to set the URL and clientId
     */
    constructor(url, clientId) {
        // set it
        this.values.url = url
        this.values.clientId = clientId
        // we might not have a non-empty clientId if it's a cross-origin fetch
        if (clientId) {
            // get the client from Client API based on clientId
            clients.get(clientId).then((client)=>{
                // set the client
                this.client = client
                // Send a message to the client.
                this.client.postMessage(this.values);
            })
        }
    }
    
    /**
     * update this.values and immediately postMessage() to the relevant client
     * 
     * data - an object with items to set in this.values
     */
    update(data) {
        // debug
        var msg = '(COMMIT_UNKNOWN) Updated SamizdatResourceInfo for: ' + this.values.url
        // was there a change? if not, no need to postMessage
        var changed = false
        // update the properties that are read-write
        Object
            .keys(data)
            .filter((k)=>{
                return ['fetchError', 'method', 'state'].includes(k)
            })
            .forEach((k)=>{
                msg += '\n+-- ' + k + ': ' + data[k]
                if (this.values[k] !== data[k]) {
                    msg += ' (changed!)'
                    changed = true
                }
                this.values[k] = data[k]
            })
        console.log(msg)
        // send the message to the client
        if (this.client && changed) {
            this.client.postMessage(this.values);
        }
    }

    /**
     * fetchError property
     */
    get fetchError() {
        return this.values.fetchError
    }

    /**
     * method property
     */
    get method() {
        return this.values.method
    }
    
    /**
     * state property
     */
    get state() {
        return this.values.state
    }
    
    /**
     * serviceWorker property (read-only)
     */
    get serviceWorker() {
        return this.values.serviceWorker
    }

    /**
     * url property (read-only)
     */
    get url() {
        return this.values.url
    }
    
    /**
     * clientId property (read-only)
     */
    get clientId() {
        return this.values.clientId
    }
}

/* ========================================================================= *\
|* === Main Brain of Samizdat                                            === *|
\* ========================================================================= */

/**
 * get a plugin by name
 * 
 * this doesn't have to be super-performant, since we should never have more
 * then a few plugins
 * (let's see how long it takes for me to eat my own words here)
 */
let getSamizdatPluginByName = (name) => {
    for (i=0; i<SamizdatPlugins.length; i++) {
        if (SamizdatPlugins[i].name === name) {
            return SamizdatPlugins[i]
        }
    }
    return null
}

/**
 * run a plugin's fetch() method
 * while handling all the auxiliary stuff like saving info in reqInfo
 * 
 * plugin     - the plugin to use
 * url        - string containing the URL to fetch
 * lastError  - error thrown by the previous plugin, if any (default: null)
 */
let samizdatFetch = (plugin, url, reqInfo) => {
    // status of the current method
    reqInfo.update({
        method: plugin.name,
        state: "running"
    })
    // log stuff
    console.log("(COMMIT_UNKNOWN) Samizdat handling URL:", url,
                '\n+-- current method : ' + plugin.name)
    // run the plugin
    return plugin.fetch(url)
}


/**
 * callign a samizdat plugin function
 * 
 * call - method name to call
 * args - arguments that will be passed to it
 */
let callOnSamizdatPlugin = (call, args) => {
    // find the first method implementing the method
    for (i=0; i<SamizdatPlugins.length; i++) {
        if (typeof SamizdatPlugins[i][call] === 'function') {
            console.log('(COMMIT_UNKNOWN) Calling plugin ' + SamizdatPlugins[i].name + '.' + call + '()')
            // call it
            return SamizdatPlugins[i][call].apply(null, args)
        } 
    }
}

/**
 * Cycles through all the plugins, in the order they got registered,
 * and returns a Promise resolving to a Response in case any of the plugins
 * was able to get the resource
 * 
 * request    - string containing the URL we want to fetch
 * clientId   - string containing the clientId of the requesting client
 * useStashed - use stashed resources; if false, only pull resources from live sources
 * doStash    - stash resources once fetched successfully; if false, do not stash pulled resources automagically
 * stashedResponse - TBD
 */
let getResourceThroughSamizdat = (request, clientId, useStashed=true, doStash=true, stashedResponse=null) => {

    // clean the URL, removing any fragment identifier
    var url = request.url.replace(/#.+$/, '');
    
    // set-up reqInfo for the fetch event
    var reqInfo = new SamizdatResourceInfo(url, clientId)
    
    // fetch counter
    self.activeFetches[clientId]++
    
    // filter out stash plugins if need be
    var SamizdatPluginsRun = SamizdatPlugins.filter((plugin)=>{
        return (useStashed || typeof plugin.stash !== 'function')
    })
    
    /**
     * this uses Array.reduce() to chain the SamizdatPlugins[]-generated Promises
     * using the Promise the first registered plugin as the default value
     * 
     * see: https://css-tricks.com/why-using-reduce-to-sequentially-resolve-promises-works/
     * 
     * this also means that SamizdatPlugins[0].fetch() below will run first
     * (counter-intutively!)
     * 
     * we are slice()-ing it so that the first plugin is only run once; it is
     * run in the initialValue parameter below already
     * 
     * ref:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
     */
    return SamizdatPluginsRun
        .slice(1)
        .reduce(
        (prevPromise, currentPlugin)=>{
            return prevPromise.catch((error)=>{
                console.log("(COMMIT_UNKNOWN) Samizdat plugin error for:", url,
                            '\n+-- method : ' + reqInfo.method,
                            '\n+-- error  : ' + error.toString())
                // save info in reqInfo -- status of the previous method
                reqInfo.update({
                    state: "error",
                    fetchError: error.toString()
                })
                return samizdatFetch(currentPlugin, url, reqInfo)
            })
        },
        // this samizdatFetch() will run first
        // all other promises generated by SamizdatPlugins[] will be chained on it
        // using the catch() in reduce() above
        // skipping this very first plugin by way of slice(1)
        samizdatFetch(SamizdatPluginsRun[0], url, reqInfo)
    )
    .then((response)=>{
        // we got a successful response
        decrementActiveFetches(clientId)
        
        // record the success
        reqInfo.update({state:"success"})
        
        // get the plugin that was used to fetch content
        plugin = getSamizdatPluginByName(reqInfo.method)
        
        // if it's a stashing plugin...
        if (typeof plugin.stash === 'function') {
            // we obviously do not want to stash
            console.log('(COMMIT_UNKNOWN) Not stashing, since resource is already retrieved by a stashing plugin:', url);
            // since we got the data from a stashing plugin,
            // let's run the rest of plugins in the background to check if we can get a fresher resource
            // and stash it in cache for later use
            console.log('(COMMIT_UNKNOWN) starting background no-stashed fetch for:', url);
            // event.waitUntil?
            // https://stackoverflow.com/questions/37902441/what-does-event-waituntil-do-in-service-worker-and-why-is-it-needed/37906330#37906330
            getResourceThroughSamizdat(request, clientId, false, true, response.clone())
            // return the response so that stuff can keep happening
            return response

        // otherwise, let's see if we want to stash
        // and if we already had a stashed version that differs
        } else {
            
            // do we have a stashed version that differs?
            if (stashedResponse && stashedResponse.headers) {
                // this is where we check if the response from whatever plugin we got it from
                // is newer than what we've stashed
                console.log('(COMMIT_UNKNOWN) checking freshness of stashed version of:', url,
                            '\n+-- stashed from   :', stashedResponse.headers.get('X-Samizdat-Method'),
                            '\n+-- fetched using  :', reqInfo.method,
                            '\n+-- stashed X-Samizdat-ETag   :', stashedResponse.headers.get('X-Samizdat-ETag'),
                            '\n+-- fetched X-Samizdat-ETag   :', response.headers.get('X-Samizdat-ETag'))
                // if the method does not match, or if it matches but the ETag doesn't
                // we have a different response
                // which means *probably* fresher content
                if ( ( stashedResponse.headers.get('X-Samizdat-Method') !== reqInfo.method )
                  || ( stashedResponse.headers.get('X-Samizdat-ETag') !== response.headers.get('X-Samizdat-ETag') ) ) {
                    // inform!
                    console.log('(COMMIT_UNKNOWN) fetched version method or ETag differs from stashed for:', url)
                    clients.get(reqInfo.clientId).then((client)=>{
                        client.postMessage({
                            url: url,
                            fetchedDiffers: true
                        })
                    })
                }
            }
            
            // do we want to stash?
            if (doStash) {
                // find the first stashing plugin
                for (i=0; i<SamizdatPlugins.length; i++) {
                    if (typeof SamizdatPlugins[i].stash === 'function') {
                        
                        // ok, now we're in business
                        console.log('(COMMIT_UNKNOWN) Stashing a successful fetch of:', url,
                                    '\n+-- fetched using  :', reqInfo.method,
                                    '\n+-- stashing using :', SamizdatPlugins[i].name)
                        response.headers.forEach(function(v, k){
                            console.log('+-- Stashing header: ', k, ' :: ', v)
                        });

                        // var cacheRequest = new Request(request, {
                        //     headers: new Headers({
                        //         'X-Samizdat-Method': reqInfo.method,
                        //         'X-Samizdat-Etag': response.headers['X-Samizdat-ETag']
                        //     })
                        // })
                        
                        // working on clone()'ed response so that the original one is not touched
                        // TODO: should a failed stashing break the flow here? probably not!
                        return SamizdatPlugins[i].stash(response.clone(), url)
                            .then((res)=>{
                                // original response will be needed further down
                                return response
                            })
                    }
                }
            }
        }
        // if we're here it means we went through the whole list of plugins 
        // and found not a single stashing plugin
        // or we don't want to stash the resources in the first place
        // that's fine, but let's make sure the response goes forth
        return response
    })
    // a final catch... in case all plugins fail
    .catch((err)=>{
        console.log("(COMMIT_UNKNOWN) Samizdat also failed completely: ", err,
                    '\n+-- URL    : ' + url)

        // cleanup
        reqInfo.update({
            state: "error",
            fetchError: err.toString()
        })
        // this is very naïve and should in fact be handled
        // inside the relevant plugin, probably
        // TODO: is this even needed?
        reqInfo.update({method: null})
        decrementActiveFetches(clientId)
        // rethrow
        throw err
    })
}

/* ========================================================================= *\
|* === Setting up the event handlers                                     === *|
\* ========================================================================= */

self.addEventListener('install', event => {
    // TODO: Might we want to have a local cache?
    // "COMMIT_UNKNOWN" will be replaced with commit ID
    console.log("0. Installed Inter-Planetary Shotgun (commit: COMMIT_UNKNOWN).");
    // TODO: should we do some plugin initialization here?
});

self.addEventListener('activate', event => {
    console.log("1. Activated Inter-Planetary Shotgun (commit: COMMIT_UNKNOWN).");
    // TODO: should we do some plugin initialization here?
});

self.addEventListener('fetch', event => {
    
    // if event.resultingClientId is available, we need to use this
    // otherwise event.clientId is what we want
    // ref. https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/resultingClientId
    var clientId = event.clientId
    if (event.resultingClientId) {
        clientId = event.resultingClientId
        // yeah, we seem to have to send the client their clientId
        // because there is no way to get that client-side
        // and we need that for sane messaging later
        // 
        // so let's also send the plugin list, why not
        // 
        // *sigh* JS is great *sigh*
        clients
            .get(clientId)
            .then((client)=>{
                client.postMessage({
                    clientId: clientId,
                    plugins: SamizdatPlugins.map((p)=>{return p.name}),
                    serviceWorker: 'COMMIT_UNKNOWN'
                })
            })
    }
    
    // counter!
    if (typeof self.activeFetches[clientId] !== "number") {
        self.activeFetches[clientId] = 0
    }
    
    // info
    console.log("(COMMIT_UNKNOWN) Fetching!",
                "\n+-- url              :", event.request.url,
                "\n+-- clientId         :", event.clientId,
                "\n+-- resultingClientId:", event.resultingClientId,
                "\n    +-- activeFetches[" + clientId + "]:", self.activeFetches[clientId]
               )

    // External requests go through a regular fetch()
    if (!event.request.url.startsWith(self.location.origin)) {
        return void event.respondWith(fetch(event.request));
    }

    // Non-GET requests go through a regular fetch()
    if (event.request.method !== 'GET') {
        return void event.respondWith(fetch(event.request));
    }

    // GET requests to our own domain that are *not* #samizdat-info requests
    // get handled by plugins in case of an error
    return void event.respondWith(getResourceThroughSamizdat(event.request, clientId))
});


/**
 * assumptions to be considered:
 * every message contains clientId (so that we know where to respond if/when we need to)
 */
self.addEventListener('message', (event) => {
    
    // inform
    var msg = '(COMMIT_UNKNOWN) Message received!'
    Object.keys(event.data).forEach((k)=>{
        msg += '\n+-- key: ' + k + " :: val: " + event.data[k]
    })
    console.log(msg);
    
    /*
     * supporting stash(), unstash(), and publish() only
     */
    if (event.data.stash || event.data.unstash || event.data.publish) { 
        if (event.data.stash) {
            callOnSamizdatPlugin('stash', event.data.stash)
        }
        if (event.data.unstash) {
            callOnSamizdatPlugin('unstash', event.data.unstash)
        }
        if (event.data.publish) {
            callOnSamizdatPlugin('publish', event.data.publish)
        }
    }
});
