var panel = chrome.devtools.panels.create('HubSpot', '/src/images/icon-16.png', '/src/devtools/panel.html', function (panel) {
	// Handle the initialization of the panel
	panel.onShown.addListener(function (window) {
		// Request the href attribute of the desired element from the inspected page
		chrome.devtools.inspectedWindow.eval("document.querySelector('.hs-tools-menu a[href*=\"/___context___/\"]').getAttribute('href')", function (elementResult) {
			const href = elementResult;

			if (!href) {
				window.document.querySelector('h1').innerText = 'No HubSpot Developer Info found';
				window.document.querySelector('#content').innerHTML = '<p>Reasons this may be happening:<ul><li>This is not a HubSpot page</li><li>You are not logged in</li><li>Adblocker blocked HubSpot scripts</li></ul>If both are true, please report back :)</p>';
			}

			// Fetch the URL and display its content in #content element
			fetch(href)
				.then(function (response) {
					return response.text();
				})
				.then(function (text) {
					window.document.querySelector('#content').innerText = text;

					//json-formatter.js
					function formatJSONinit(j) {
						let pre = window.document.querySelector('body > pre');
						if (!pre) {
							console.log('No JSON found');
							return;
						}

						const raw = pre.textContent;
						console.log(j[0]);
						// double check
						if (j[0] != '{') {
							console.log('Not JSON?');
							return;
						}

						// hide original pre
						pre.setAttribute('hidden', true);
						pre.setAttribute('id', 'raw');

						//console.log(raw)
						const hsJSON = Promise.resolve(formatJSON(j)).then((json) => {
							//console.log(json)
							// TODO: json is not globally available and it breaks the panel
							//window.json = json;
							//console.log("JSON is now available in the console as window.json");
							return json;
						});
						window.json = hsJSON;

						return true;
					}

					async function formatJSON(raw) {
						console.log('formatting JSON');
						let wrapper = window.document.createElement('div');
						wrapper.id = 'json-formated';
						let json = false;
						try {
							json = JSON.parse(raw);
						} catch (err) {
							console.log(err);
							return;
						}

						// generate HTML based on JSON recursively
						const html = generateHTML(json);
						console.log('HTML generated');

						//console.log(html);
						wrapper.innerHTML = html;

						// add to page
						window.document.querySelector('body').appendChild(wrapper);

						// add CSS
						const style = window.document.createElement('style');
						style.id = 'json-formatter-style';

						style.innerHTML = `
                    :root{
                        --font-size: 1.2rem;
                        --list-bg: rgba(200,200,200,.1);
                        --list-bg-hover: rgba(200,200,200,.05);
                        --list-border: rgba(200,200,200,.2);
                        --list-border-hover: rgba(200,200,200,1);
                        --snippet-bg: rgba(0,0,0,1);
                        --snippet-color: #fff;
                        --color-string: blue;
                        --color-number: red;
                        --color-boolean: green;
                        --scrollbar-bg: rgba(241,241,241,.15);
                        --scrollbar-thumb: #888;
                        --scrollbar-thumb-hover: #555;
                    }
                    body{
                        font-family: monospace;
                        font-size: var(--font-size);
                    }
                    ul {
                        list-style-type: none;
                        padding-left: .5rem;
                        margin-left: 2rem;
                        /*background-color: var(--list-bg);*/
                        border-left: 1px solid var(--list-border);
                        transition: background-color .4s;
                    }
                    ul:hover{
                        //background-color: var(--list-bg-hover);
                        border-color: var(--list-border-hover);
                    }
                    ul:before: {
                        content: "";
                    }
                    [data-wrapper="object"]:before {
                        content: "- ";
                    }
                    .minimized:before {
                        content: "+ ";
                    }
                    .minimized > ul{
                        height: 0;
                        overflow: hidden;
                    }
                    /*
                    .dict:after {
                        content: "}";
                    }
                    .list:after {
                        content: "]";
                    }
                    */
                   .key, .value {
                        cursor: pointer;
                   }
                    [data-wrapper="object"] > .key:after{
                        content: "{";
                    }
                    [data-wrapper="object"]:after{
                        content: "}";
                    }
                    [data-wrapper="list"] .key:after{
                        content: "[";
                    }
                    [data-wrapper="list"]:after{
                        content: "]";
                    }
                    [data-type="string"] {
                        color: var(--color-string);
                    }
                    [data-type="number"] {
                        color: var(--color-number);
                    }
                    [data-type="boolean"] {
                        color: var(--color-boolean);
                    }
                    pre,code{
                        white-space: nowrap;
                        overflow: auto;
                    }
                    code::-webkit-scrollbar {
                        width: 5px;
                        height: 5px;
                    }
                    code::-webkit-scrollbar-track {
                        background: var(--scrollbar-bg);
                    }
                    code::-webkit-scrollbar-thumb {
                        background: var(--scrollbar-thumb);
                    }
                    code::-webkit-scrollbar-thumb:hover {
                        background: var(--scrollbar-thumb-hover);
                    }
                    [data-wrapper="string"],
                    [data-wrapper="null"],
                    [data-wrapper="boolean"],
                    [data-wrapper="number"] {
                        display: flex;
                        align-items: flex-start;
                        gap: .5rem;
                    }
                    [data-snippet]{
                        position: relative;
                    }
                    [data-snippet]:before {
                        content: attr(data-snippet);
                        position: fixed;
                        opacity: 0;
                        background-color: var(--snippet-bg);
                        color: var(--snippet-color);
                        top: 1rem;
                        left: 1rem;
                        transition: opacity .4s;
                        z-index: 1;
                    }

                    [data-snippet]:hover:before {
                        opacity: 1;
                    }

                    `;
						window.document.querySelector('head').appendChild(style);

						// add event listeners
						Promise.resolve(html).then(async function () {
							await generateEvents();
							console.log('events generated');
						});
						return json;
					}

					function generateHTML(json, childNum = 0) {
						let html = '';
						if (Array.isArray(json)) {
							//console.log("array")
							html += "<ul class='list'>";
							for (let i = 0; i < json.length; i++) {
								const wrapperClass = typeof json[i];
								html += `<li data-wrapper="${wrapperClass}">`;
								html += `<span class='key' data-key="[${i}]">[${i}]: </span>`;
								/*
                            const childHTML = generateHTML(json[i], i);
                            Promise.resolve(childHTML).then((childHTML) => {
                                html += childHTML;
                            });
                            */
								//html += await generateHTML(json[i],i);
								html += generateHTML(json[i], i);
								html += '</li>';
							}
							html += '</ul>';
						} else if (typeof json == 'object' && json != null) {
							//console.log("object")
							html += "<ul class='dict'>";
							let i = 0;
							for (let key in json) {
								if (typeof json[key] == 'string') {
									val = json[key].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
									html += `<li data-wrapper="string">`;
									html += `<span class='key' data-key="${key}">${key}: </span>`;
									html += `<code class="value" data-type="string" data-child-number='${childNum}'>${val}</code>`;
									html += '</li>';
								} else if (json[key] == null) {
									html += `<li data-wrapper="null">`;
									html += `<span class='key' data-key="${key}">${key}: </span>`;
									html += `<code class="value" data-type="null" data-child-number='${childNum}'>${json[key]}</code>`;
									html += '</li>';
								} else {
									const wrapperClass = typeof json[key];
									html += `<li data-wrapper="${wrapperClass}">`;
									html += `<span class='key' data-key="${key}">${key}: </span>`;
									/*
                                const childHTML = generateHTML(json[key], i);
                                Promise.resolve(childHTML).then((childHTML) => {
                                    html += childHTML;
                                });
                                */
									//html += await generateHTML(json[key], i);
									html += generateHTML(json[key], i);
									html += '</li>';
									i++;
								}
							}
							html += '</ul>';
						} else if (json == null) {
							html += `<code class="value" data-type="null" data-child-number='${childNum}'>${json}</code>`;
						} else {
							const type = typeof json;
							// if it's a string, replace HTML chars
							if (typeof json == 'string') json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
							//console.log(json);

							html += `<code class="value" data-type="${type}" data-child-number='${childNum}'>${json}</code>`;
						}

						return html;
					}

					async function generateEvents() {
						// add event listeners
						const wrappers = window.document.querySelectorAll('[data-wrapper="object"]');
						wrappers.forEach((wrapper) => {
							wrapper.addEventListener('click', function (e) {
								if (wrapper !== e.target) return; // only if you not clicked on a child
								wrapper.classList.toggle('minimized');
							});

							wrapper.addEventListener('mouseover, mouseout', function (e) {
								if (wrapper !== e.target) return; // only if you not clicked on a child
								wrapper.classList.toggle('hover');
							});
						});
						const values = window.document.querySelectorAll('.value');
						values.forEach((value) => {
							value.addEventListener('click', function () {
								copyToClipboard(value.textContent);
							});
						});

						const keys = window.document.querySelectorAll('.key');
						keys.forEach((key) => {
							key.addEventListener('click', async function () {
								const snippet = await generateSnippet(key);
								Promise.resolve(snippet).then((snippet) => {
									copyToClipboard(snippet);
								});
							});
							key.addEventListener('mouseover', async function () {
								if (key.dataset.snippet) return; // if it already has a key, don't do anything (this is to prevent the key from being overwritten when you hover over a child element)
								// recursive function to get the key
								const snippet = await generateSnippet(key);
								Promise.resolve(snippet).then((snippet) => {
									key.dataset.snippet = snippet;
								});
								// remove listener
								key.removeEventListener('mouseover', arguments.callee);
							});
						});

						// all ULs will add the text on .key element (which is the previous sibling) to the :before element in the ul on hover.
						const uls = window.document.querySelectorAll('ul');
						uls.forEach((ul) => {
							ul.addEventListener('mouseover', async function () {
								if (ul.dataset.snippet) return; // if it already has a key, don't do anything (this is to prevent the key from being overwritten when you hover over a child element)
								let key = '';
								// recursive function to get the key
								if (ul.previousSibling && ul.previousSibling.classList.contains('key')) {
									const snippet = await generateSnippet(ul.previousSibling);
									Promise.resolve(snippet).then((snippet) => {
										ul.dataset.snippet = snippet;
									});
								}
								// remove listener
								ul.removeEventListener('mouseover', arguments.callee);
							});
							ul.addEventListener('mouseout', function () {
								//ul.dataset.key = "";
							});
						});
					}

					//generate the snippet parentKey.childKey etc
					async function generateSnippet(key) {
						let snippet = '';
						// remove all selected classes
						window.document.querySelectorAll('.selected').forEach((li) => {
							li.classList.remove('selected');
						});
						// add selected class to all parents
						let parent = key.closest('li');
						while (parent) {
							parent.classList.add('selected');
							parent = parent.parentElement.closest('li');
						}
						if (key.dataset.snippet) {
							console.log(key.dataset.snippet);
							return key.dataset.snippet;
						}

						window.document.querySelectorAll('.selected').forEach((li) => {
							if (li.parentElement.classList.contains('list')) {
								const index = Array.from(li.parentNode.children).indexOf(li);
								snippet = `(${snippet}[${index}])`;
							} else {
								k = li.querySelector('.key').dataset.key;
								// add the key
								if (k) {
									if (k.includes(' ') || k.includes('.')) {
										k = `["${k}"]`;
									} else {
										k = `${k}`;
									}
								}
								if (!snippet.length) snippet = `${k}`;
								else snippet = `${snippet}.${k}`;
							}
						});
						snippet = `{{ ${snippet} }}`;
						key.dataset.snippet = snippet;

						console.log(snippet);
						return snippet;
					}

					function copyToClipboard(text) {
						const el = window.document.createElement('textarea');
						el.value = text;
						window.document.body.appendChild(el);
						el.select();
						window.document.execCommand('copy');
						window.document.body.removeChild(el);
					}

					formatJSONinit(text);
					window.document.querySelector('h1').innerText = 'DONE!';
					window.document.querySelector('.explanation').style = 'display:none';
					return true;
				})
				.catch(function (err) {
					console.log(err);
				});
		});
	});
});
console.log('devtools.js ran');
