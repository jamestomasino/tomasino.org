/* ========================================================================= *\
|* === Basic utils useful only in browser window                         === *|
\* ========================================================================= */

// create an object to hold everything that needs to be held globally
var samizdat = {
    info: {},
    status: false,
    contentUnavailable: false,
    cacheStale: false,
    clientId: null
}

// some basic method stats
samizdat.methodStats = {}
// UI elements displaying the status for each local resource URL
samizdat.resourceDisplays = {}


/**
 * creating a safe CSS class name from a string
 */
samizdat.safeClassName = (name) => {
    return encodeURIComponent(name.toLowerCase()).replace(/%[0-9A-F]{2}/gi,'-')
}


/**
 * creating the standalone Samizdat UI
 */
samizdat.addUI = () => {
    var uiTemplate = document.createElement('template')
    uiTemplate.innerHTML = `<div id="samizdat-ui">
    <div class="samizdat-message-container"></div>
    <div id="samizdat-ui-container" class="samizdat-status-service-worker">
        <input type="checkbox" id="samizdat-ui-toggle"/>
        <div class="samizdat-description">
            <p><a href="https://samizdat.is/">Samizdat</a> is a tool that helps circumvent web censorship.<br/>If you are seeing this it means some content is blocked or unavailable.<br/>Samizdat will attempt to get it for you anyway.</p>
            <div class="samizdat-status-display"></div>
        </div>
        <label for="samizdat-ui-toggle" class="samizdat-toggle"><div></div></label>
    </div></div>`
    var uiStyle = document.createElement('style')
    uiStyle.innerHTML = `#samizdat-ui {
            display:flex;
            align-items: flex-end;
            flex-direction:column-reverse;
            flex-wrap:nowrap;
            position:fixed;
            top:0px;
            right:0px;
            visibility:hidden;
        }
        #samizdat-ui.content-unavailable,
        #samizdat-ui:target {
            visibility:visible;
        }
        #samizdat-ui .samizdat-message-container {
        }
        #samizdat-ui .samizdat-message {
            font-size:90%;
            text-align:center;
            background:#dfd;
            border-radius:1em;
            box-shadow:0px 0px 3px #dfd;
            padding:0.5em 2em 0.5em 1em;
            transition: ease-in 0.5s opacity;
            opacity: 1;
            position: relative;
            top:16px;
            right:5px;
            color: #060;
            text-shadow: 0px 0px 2px white;
            font-family: sans;
        }
        #samizdat-ui .samizdat-message::after {
            display: block;
            content: "x";
            position: absolute;
            right: 0.5em;
            top: 0.7em;
            font-size:90%;
            border-radius: 100%;
            width: 1em;
            height: 1em;
            line-height: 0.8em;
            padding-left: 0.01em;
            box-shadow: inset 0px 0px 2px #080;
            transition: ease-in 0.5s color, ease-in 0.5s background-color, ease-in 0.5s box-shadow-color;
            color: #080;
            background:white;
        }
        #samizdat-ui .samizdat-message:hover::after {
            background: #080;
            color: white;
            box-shadow: inset 0px 0px 2px black;
        }
        #samizdat-ui .samizdat-message:first-child::before {
            display:block;
            content:" ";
            width:1em;
            height:1em;
            position:absolute;
            right:1em;
            top:-0.5em;
            background:#dfd;
            box-shadow:0px 0px 3px #dfd;
            transform: rotate(45deg);
            z-index:-1;
        }
        #samizdat-ui-container {
            background:#ddd;
            box-shadow:0px 0px 3px black;
            border-bottom-left-radius:30px;
            padding: 4px 4px 8px 8px;
            display:flex;
            flex-wrap:nowrap;
        }
        #samizdat-ui-container .samizdat-toggle {
            width:32px;
            height:32px;
            background:url('data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MCA5MCIgeD0iMHB4IiB5PSIwcHgiPjx0aXRsZT5iYWxsMjwvdGl0bGU+PGcgZGF0YS1uYW1lPSJMYXllciAyIj48cGF0aCBkPSJNOTIuMTQsMzkuMjZhNDEuOCw0MS44LDAsMCwwLTEuMjktNUE0NSw0NSwwLDEsMCw0Ny40Nyw5M0g0OGE0NC4zNSw0NC4zNSwwLDAsMCw0LjY0LS4yNEE0NS4wNyw0NS4wNywwLDAsMCw5Myw0OCw0NC4yMSw0NC4yMSwwLDAsMCw5Mi4xNCwzOS4yNlpNMjksMjQuMTZBMzAuMzgsMzAuMzgsMCwwLDAsMTcuNTEsNDhhMi40MSwyLjQxLDAsMSwxLTQuODEsMEEzNS4xNCwzNS4xNCwwLDAsMSwyNiwyMC40MWEyLjQsMi40LDAsMSwxLDMsMy43NVptMTktNi42NWEzMC40NiwzMC40NiwwLDAsMC0xMC4yOSwxLjc3LDIuMjgsMi4yOCwwLDAsMS0uODEuMTUsMi40MSwyLjQxLDAsMCwxLS44MS00LjY4QTM1LjM4LDM1LjM4LDAsMCwxLDQ4LDEyLjdhMi40MSwyLjQxLDAsMSwxLDAsNC44MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zIC0zKSI+PC9wYXRoPjwvZz48L3N2Zz4=') center center no-repeat;
            display: block;
            background-size:contain;
        }
        #samizdat-ui-container .samizdat-toggle > div {
            width:100%;
            height:100%;
            background:url('data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjRjk3OTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTIgNTIiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUyIDUyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48Zz48cGF0aCBkPSJNMzYsMTEuMDI5NzU0Nmg3LjM2MjYwOTljLTAuMDc3ODgwOS0wLjEwMDIxOTctMC4xNTExODQxLTAuMjAzMzA4MS0wLjI0MjYxNDctMC4yOTQ3Mzg4bC03LjgyOTk1NjEtNy44MzAwMTcxICAgIEMzNS4yMDA4MDU3LDIuODE1NzY1NCwzNS4wOTg3NTQ5LDIuNzQzNDM4NywzNSwyLjY2NjcxNzV2Ny4zNjMwMzcxQzM1LDEwLjU4MTAyNDIsMzUuNDQ4NzMwNSwxMS4wMjk3NTQ2LDM2LDExLjAyOTc1NDZ6Ij48L3BhdGg+PC9nPjxnPjxwYXRoIGQ9Ik0zNiwxMy4wMjk3NTQ2Yy0xLjY1NDI5NjksMC0zLTEuMzQ1NzAzMS0zLTNWMi4wMjQ5OTM5SDExYy0xLjY0OTk2MzQsMC0zLDEuMzUwMDM2Ni0zLDN2NDEuOTUwMDEyMiAgICBjMCwxLjY2MDAzNDIsMS4zNTAwMzY2LDMsMywzaDMwYzEuNjUwMDI0NCwwLDMtMS4zMzk5NjU4LDMtM1YxMy4wMjk3NTQ2SDM2eiBNMjEsMTkuMDAyODk5MmgxMHYySDIxVjE5LjAwMjg5OTJ6IE0zMSw0My4wMDMzODc1ICAgIEgyMXYtMmgxMFY0My4wMDMzODc1eiBNMzcsMzYuMDAzMzg3NUgxNXYtMmgyMlYzNi4wMDMzODc1eiBNMzcsMjguMDAyODk5MkgxNXYtMmgyMlYyOC4wMDI4OTkyeiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+') center center no-repeat;
            display: block;
            background-size:50% 50%;
        }
        #samizdat-ui-container.active .samizdat-toggle {
            animation-name: samizdat-ball-rolling;
            animation-duration:10s;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
        }
        #samizdat-ui-container #samizdat-ui-toggle {
            display:none;
        }
        #samizdat-ui-container > div {
            display:none;
        }
        #samizdat-ui-container > #samizdat-ui-toggle:checked ~ div {
            display:block;
        }
        #samizdat-ui-container .samizdat-description > p {
            font-size:80%;
            margin-top: 0.5em;
            margin-bottom: 0.5em;
            margin-right: 1em;
            text-align: right;
            text-shadow: -1px -1px 0px #ccc, 1px 1px 0px #eee;
            color: #666;
            font-family: sans-serif;
        }
        #samizdat-ui-container .samizdat-description > p a {
            color: #d70;
        }
        #samizdat-ui-container .samizdat-status-display {
            justify-content: right;
            display: flex;
            padding-right: 0.5em;
        }
        /*
         * these will be useful also outside the #samizdat-ui
         * for example, if there is a .samizdat-status-display in the page's HTML
         */
        .samizdat-status-display > li {
            display:inline-block;
            font-size:80%;
            font-family: Monospace;
        }
        .samizdat-status-element {
            font-weight: bold;
            display: inline-block;
            text-align: center;
            text-decoration:none;
            background:#bbb;
            padding:0.4em 1em;
            border-radius:0.6em;
            color:#777;
            box-shadow: inset 0px 0px 3px #777;
            margin: 0.5em;
            transition: background-color 1s ease, color 1s ease, box-shadow 1s ease;
        }
        .samizdat-status-element.active {
            box-shadow: 0px 0px 3px #f80, 0px 0px 3px #a60;
            color: #fff;
            background: #e70;
        }
        @keyframes samizdat-ball-rolling {
            from {transform:rotate(0deg)}
            to {transform:rotate(359deg)}
        }`
    document.head.insertAdjacentElement('afterbegin', uiStyle)
    document.body.insertAdjacentElement('afterbegin', uiTemplate.content.firstChild)
}


/**
 * fetched resource display element
 */
samizdat.addFetchedResourceElements = (url, fetchedResourcesDisplays) => {
    // make sure we have the container element to work with
    if (typeof fetchedResourcesDisplays !== 'object') {
        fetchedResourcesDisplays = document.getElementsByClassName("samizdat-fetched-resources-list")
    }
    var itemHTML = `<li class="samizdat-fetched-resources-item"><label>`
    var foundSuccess = false
    var pluginsHTML = ''
    Object.keys(samizdat.methodStats).forEach((plugin)=>{
        var pclass = samizdat.safeClassName(plugin)
        if (typeof samizdat.info[url] !== "undefined" && typeof samizdat.info[url][plugin] !== "undefined") {
            pclass = pclass + ' ' + samizdat.info[url][plugin].state;
            foundSuccess = foundSuccess || (samizdat.info[url][plugin].state === "success")
        }
        pluginsHTML += `<span class="samizdat-fetched-resource-method ${pclass}">${plugin}</span>`
    })
    itemHTML += `<input type="checkbox" ${ foundSuccess ? 'checked="checked"' : 'disabled="disabled"' }/><span class="samizdat-fetched-resource-url"><span>${url}</span></span>${pluginsHTML}</label></li>`;
    var item = document.createElement('template')
    item.innerHTML = itemHTML;
    samizdat.resourceDisplays[url] = new Array()
    for (let frd of fetchedResourcesDisplays) {
        samizdat.resourceDisplays[url].push( 
            frd.insertAdjacentElement('beforeend', item.content.firstChild.cloneNode(true))
        )
    }
}


/**
 * creating/updating fetched resources data
 */
samizdat.updateFetchedResources = () => {
    // getting these elements once instead of once per URL...
    var fetchedResourcesDisplays = document.getElementsByClassName("samizdat-fetched-resources-list")
    Object.keys(samizdat.info).forEach((url)=>{
        
        // simplify
        si = samizdat.info[url]
        
        // if there are no status display elements for this URL...
        if (typeof samizdat.resourceDisplays[url] === 'undefined') {
            // ...create the elements
            samizdat.addFetchedResourceElements(url, fetchedResourcesDisplays)
        
        // otherwise, if si.method evaluates to true (i.e. is not an empty string nor null in this case)
        } else {
            // samizdat.methodStats has the most comprehensive list of methods used
            Object.keys(samizdat.methodStats).forEach((method)=>{
                var pclass = samizdat.safeClassName(method);
                var foundSuccess = false
                // do we have the method even?
                if (typeof si[method] === "object") {
                    // is this a success?
                    if (si[method].state === "success") {
                        for (let rdisplay of samizdat.resourceDisplays[url]) {
                            if (! rdisplay.getElementsByClassName(pclass)[0].classList.contains('success')) {
                                // make sure the right classes are on
                                rdisplay.getElementsByClassName(pclass)[0].classList.remove('running')
                                rdisplay.getElementsByClassName(pclass)[0].classList.add('success')
                                // make sure the checkbox is checked
                                rdisplay.getElementsByTagName('input')[0].checked = true
                                rdisplay.getElementsByTagName('input')[0].disabled = false
                            }
                        }
                    // is this a running thing?
                    } else if (si[method].state === "running") {
                        for (let rdisplay of samizdat.resourceDisplays[url]) {
                            if (! rdisplay.getElementsByClassName(pclass)[0].classList.contains('running')) {
                                // make sure the right classes are on
                                rdisplay.getElementsByClassName(pclass)[0].classList.remove('success')
                                rdisplay.getElementsByClassName(pclass)[0].classList.add('running')
                            }
                        }
                    // nope, an error presumably
                    } else {
                        for (let rdisplay of samizdat.resourceDisplays[url]) {
                            // make sure the right classes are on
                            rdisplay.getElementsByClassName(pclass)[0].classList.remove('success')
                            rdisplay.getElementsByClassName(pclass)[0].classList.remove('running')
                        }
                    }
                // clarly this method has not even been used for the resource
                } else {
                    for (let rdisplay of samizdat.resourceDisplays[url]) {
                        // make sure the right classes are on
                        rdisplay.getElementsByClassName(pclass)[0].classList.remove('success')
                        rdisplay.getElementsByClassName(pclass)[0].classList.remove('running')
                    }
                }
            })
        }
    })
}


/**
 * adding status display per plugin
 *
 * plugin      - plugin name
 * description - plugin description (optional; default: empty string)
 * status      - status text (optional; default: number of resources fetched
 *               using this plugin, based on methodStats)
 */
samizdat.addPluginStatus = (plugin, description='', status=null) => {
    console.log('(COMMIT_UNKNOWN) addPluginStatus(' + plugin + ')')
    var statusDisplays = document.getElementsByClassName("samizdat-status-display");
    var pclass = encodeURIComponent(plugin.toLowerCase()).replace(/%[0-9A-F]{2}/gi,'-');
    var pcount = 0;
    if (typeof samizdat.methodStats[plugin] !== 'undefined') {
        pcount = samizdat.methodStats[plugin];
    }
    for (let sd of statusDisplays) {
        sd.insertAdjacentHTML('beforeend', `<li><abbr class="samizdat-status-element ${pcount ? 'active' : ''} samizdat-status-${pclass}" title="${description}">${plugin}: <span class="status">${status ? status : pcount}</span></abbr></li>`)
    }
}


/**
 * updating status display per plugin
 *
 * expects an object that contains at least `name` attribute
 */
samizdat.updatePluginStatus = (plugin) => {
    //console.log('updatePluginStatus :: ' + plugin)
    var pclass = samizdat.safeClassName(plugin);
    //console.log('updatePluginStatus :: pclass: ' + pclass)
    var statusDisplay = document.querySelectorAll(".samizdat-status-" + pclass + " > .status");
    //console.log('updatePluginStatus :: statusDisplay: ' + typeof statusDisplay)
    var pcount = 0;
    if (typeof samizdat.methodStats[plugin] !== 'undefined') {
        pcount = samizdat.methodStats[plugin]
    }
    for (let statusDisplay of document.querySelectorAll(".samizdat-status-" + pclass + " > .status")) {
        statusDisplay.innerText = pcount
        if ( (pcount === 0) && statusDisplay.parentElement.classList.contains('active')) {
            statusDisplay.parentElement.classList.remove('active')
        } else if ( (pcount > 0) && ! statusDisplay.parentElement.classList.contains('active')) {
            statusDisplay.parentElement.classList.add('active')
        }
    }
}


/**
 * toggling resource checkboxes (only if not disabled)
 */
samizdat.toggleResourceCheckboxes = () => {
    document.querySelectorAll('.samizdat-fetched-resources-item input')
        .forEach((el)=>{ 
            el.checked = ! el.disabled && ! el.checked
        })
}


/**
 * stashing and unstashing resources
 * 
 * stash param means "stash" if set to true (the default), "unstash" otherwise
 */
samizdat.stashOrUnstashResources = (stash=true) => {
    // what are we doing?
    operation = {
        clientId: samizdat.clientId
    }
    // get the resources
    var resources = []
    document
        .querySelectorAll('.samizdat-fetched-resources-item input:checked')
        .forEach((el)=>{
            resources.push(el.parentElement.querySelector('.samizdat-fetched-resource-url').innerText)
        })
    if (stash) {
        operation.stash = [resources]
        console.log('(COMMIT_UNKNOWN) Calling `stash()` on the service worker to stash the resources...')
    } else {
        operation.unstash = [resources]
        console.log('(COMMIT_UNKNOWN) Calling `unstash()` on the service worker to unstash the resources...')
    }
    // RPC call on the service worker
    return navigator
            .serviceWorker
            .controller
            .postMessage(operation)
}


/**
 * publishing certain resources to Gun+IPFS
 */
samizdat.publishResourcesToGunAndIPFS = () => {
    var user = document.getElementById('samizdat-gun-user').value
    var pass = document.getElementById('samizdat-gun-password').value
    if (! user || ! pass) {
        throw new Error("Gun user/password required!")
    }
    var resources = []
    document.querySelectorAll('.samizdat-fetched-resources-item input:checked')
        .forEach((el)=>{
            resources.push(el.parentElement.querySelector('.samizdat-fetched-resource-url').innerText)
        })
    // call it!
    console.log('(COMMIT_UNKNOWN) Calling `publish()` on the service worker to publish the resources...')
    return navigator
            .serviceWorker
            .controller
            .postMessage({
                clientId: samizdat.clientId,
                publish: [resources, user, pass]
            })
}


/**
 * display a Samizdat message
 */
samizdat.displayMessage = (msg) => {
    // prepare the template
    var messageBox = document.createElement('template')
    messageBox.innerHTML = `<div class="samizdat-message">${msg}</div>`
    // attach it to all samizdat-message-containers out there
    for (let smc of document.getElementsByClassName('samizdat-message-container')) {
        var msg = messageBox.content.firstChild.cloneNode(true)
        msg.onclick = (e) => {
            e.target.style.opacity=0
            setTimeout(()=>{e.target.remove()}, 1000)
        }
        smc.insertAdjacentElement('beforeend', msg)
        setTimeout(()=>{
            msg.style.opacity=0
            setTimeout(()=>{msg.remove()}, 1000)
        }, 5000)
    }
    console.log('    +-- message shown!')
}

/**
 * onload handler just to mark stuff as loaded
 * for purposes of informing the user all is loaded
 * when service worker messages us about it
 */
window.addEventListener('load', function() {
    samizdat.status = "loaded";
    /*
     * status display: how did this file get fetched?
     *
     * yes, this code has to be directly here,
     * since we want to know how *this exact file* got fetched
     */
    if (typeof samizdat.info[window.location.href] === 'object') {
        // service worker info
        for (let samizdat_sw of document.querySelectorAll(".samizdat-status-service-worker")) {
            samizdat_sw.className += " active";
            try {
                samizdat_sw.querySelector('.status').innerHTML = "yes";
            } catch(e) {}
        }
    }
    // was any content blocked so far?
    if (samizdat.contentUnavailable) {
        samizdat.displayMessage('Some content seems blocked or unavailable. Attempting to retrieve it via Samizdat.')
    }
})

console.log('(COMMIT_UNKNOWN) DOMContentLoaded!')

// add the generic service worker "badge"
samizdat.addUI()
samizdat.addPluginStatus('service worker', 'A service worker is an event-driven worker that intercepts fetch events.', 'no')

/* ========================================================================= *\
|* === Service worker setup                                              === *|
\* ========================================================================= */

if ('serviceWorker' in navigator) {
    
    if (navigator.serviceWorker.controller) {
        // Service worker already registered.
        console.log('(COMMIT_UNKNOWN) Service Worker already registered.')
    } else {
        var scriptPath = document.currentScript.src
        var scriptFolder = scriptPath.substr(0, scriptPath.lastIndexOf( '/' )+1 )
        var serviceWorkerPath = scriptFolder + 'service-worker.js'
        console.log('Service Worker script at: ' + serviceWorkerPath)
        navigator.serviceWorker.register(serviceWorkerPath, {
            scope: './'
        }).then(function(reg) {
            // Success.
            console.log('(COMMIT_UNKNOWN) Service Worker registered.')
        }).catch(error => {
            console.log("(COMMIT_UNKNOWN) Error while registering a service worker: ", error)
        })
    }
    
    // handling the messages from ServiceWorker
    navigator.serviceWorker.addEventListener('message', event => {
        console.log('SamizdatInfo received!')
        if (event.data.url) {
            console.log('+-- for:', event.data.url)
            if (event.data.method) {
                console.log('    +-- method:', event.data.method)
                console.log('    +-- state :', event.data.state)
                samizdat.info[event.data.url] = samizdat.info[event.data.url] || {}
                samizdat.info[event.data.url][event.data.method] = event.data
                // update method stats
                if (typeof samizdat.methodStats[event.data.method] === 'undefined') {
                    // setup the stats
                    samizdat.methodStats[event.data.method] = 0
                    // but also we now know this method has not been seen before
                    // so set-up the plugin status display
                    samizdat.addPluginStatus(event.data.method)
                }
                if (event.data.state === "success") {
                    samizdat.methodStats[event.data.method]++
                    console.log('        +-- methodStats incremented to:', samizdat.methodStats[event.data.method])
                    samizdat.updatePluginStatus(event.data.method)
                
                // if the method was `fetch`, and that was the first method, and the outcome is `error`, we *might* be blocked
                } else if ( event.data.state === "error"
                         && event.data.method === "fetch"
                         && Object.keys(samizdat.info[event.data.url]).length === 1
                         && Object.keys(samizdat.info[event.data.url])[0] === "fetch" ) {
                    // we seem to be blocked
                    document.getElementById('samizdat-ui').classList.add('content-unavailable')
                    // if contentUnavailable is false, that means this is the first time we hit a problem fetching
                    if (!samizdat.contentUnavailable) {
                        // mark it properly
                        samizdat.contentUnavailable = true
                        // if loaded, show the message to the user.
                        // if not, the message will be shown on `load` event anyway
                        if (samizdat.status === "loaded") {
                            samizdat.displayMessage('Some content seems blocked or unavailable. Attempting to retrieve it via Samizdat.')
                        }
                    }
                }
                // update the fetched resources display
                // TODO: this updates *all* resources on each received message,
                // TODO: and so is rather wasteful
                samizdat.updateFetchedResources()
            }
            // we only want to mark that new content is available, and handle the message
            // at allFetched event
            if (event.data.fetchedDiffers) {
                console.log('    +-- fetched version apparently differs from cached for:', event.data.url)
                // record fo the URL
                samizdat.info[event.data.url].cacheStale = true
                // record gloally
                samizdat.cacheStale = true
            }
        }
        if (event.data.allFetched) {
            if (samizdat.status === "loaded") {
                // set the status so that we don't get the message doubled
                samizdat.status = "complete"
                // inform the user
                if (samizdat.cacheStale) {
                    samizdat.displayMessage('Newer version of this page is available; please reload to see it.')
                } else {
                    console.log('+-- all fetched!..')
                    samizdat.displayMessage('Fetching via Samizdat finished; no new content found.')
                }
            }
        }
        if (event.data.clientId) {
            console.log('+-- got our clientId:', event.data.clientId)
            samizdat.clientId = event.data.clientId
        }
        if (event.data.plugins) {
            var msg = '+-- got the plugin list:'
            event.data.plugins.forEach((p)=>{
                msg += '\n    +-- ' + p
                // initialize methodStats
                if (typeof samizdat.methodStats[p] === 'undefined') {
                    samizdat.methodStats[p] = 0
                    // set-up the plugin status display
                    samizdat.addPluginStatus(p)
                }
            })
            console.log(msg)
        }
        if (event.data.serviceWorker) {
            console.log('+-- got the serviceWorker version:', event.data.serviceWorker)
            samizdat_sws = document.getElementsByClassName("samizdat-commit-service-worker");
            for (let element of samizdat_sws) {
                element.innerHTML = event.data.serviceWorker;
            }
        }
    });
}
