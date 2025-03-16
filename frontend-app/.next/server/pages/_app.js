/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var wagmi_providers_public__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! wagmi/providers/public */ \"wagmi/providers/public\");\n/* harmony import */ var wagmi_providers_jsonRpc__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! wagmi/providers/jsonRpc */ \"wagmi/providers/jsonRpc\");\n/* harmony import */ var wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! wagmi/connectors/metaMask */ \"wagmi/connectors/metaMask\");\n/* harmony import */ var wagmi_connectors_coinbaseWallet__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! wagmi/connectors/coinbaseWallet */ \"wagmi/connectors/coinbaseWallet\");\n/* harmony import */ var wagmi_connectors_injected__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! wagmi/connectors/injected */ \"wagmi/connectors/injected\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([wagmi__WEBPACK_IMPORTED_MODULE_3__, wagmi_providers_public__WEBPACK_IMPORTED_MODULE_4__, wagmi_providers_jsonRpc__WEBPACK_IMPORTED_MODULE_5__, wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_6__, wagmi_connectors_coinbaseWallet__WEBPACK_IMPORTED_MODULE_7__, wagmi_connectors_injected__WEBPACK_IMPORTED_MODULE_8__]);\n([wagmi__WEBPACK_IMPORTED_MODULE_3__, wagmi_providers_public__WEBPACK_IMPORTED_MODULE_4__, wagmi_providers_jsonRpc__WEBPACK_IMPORTED_MODULE_5__, wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_6__, wagmi_connectors_coinbaseWallet__WEBPACK_IMPORTED_MODULE_7__, wagmi_connectors_injected__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\n\n\n// Define Base Sepolia testnet\nconst baseSepolia = {\n    id: 84532,\n    name: \"Base Sepolia\",\n    network: \"base-sepolia\",\n    nativeCurrency: {\n        decimals: 18,\n        name: \"Sepolia ETH\",\n        symbol: \"ETH\"\n    },\n    rpcUrls: {\n        public: {\n            http: [\n                \"https://sepolia.base.org\" || 0\n            ]\n        },\n        default: {\n            http: [\n                \"https://sepolia.base.org\" || 0\n            ]\n        }\n    },\n    blockExplorers: {\n        default: {\n            name: \"BaseScan\",\n            url: \"https://sepolia.basescan.org\"\n        }\n    },\n    testnet: true\n};\n// Configure chains & providers with better fallback options\nconst { chains, provider, webSocketProvider } = (0,wagmi__WEBPACK_IMPORTED_MODULE_3__.configureChains)([\n    baseSepolia\n], [\n    (0,wagmi_providers_jsonRpc__WEBPACK_IMPORTED_MODULE_5__.jsonRpcProvider)({\n        rpc: (chain)=>{\n            if (chain.id === baseSepolia.id) {\n                // Use environment variable or fallback\n                return {\n                    http: \"https://sepolia.base.org\" || 0\n                };\n            }\n            return null;\n        },\n        priority: 0\n    }),\n    (0,wagmi_providers_public__WEBPACK_IMPORTED_MODULE_4__.publicProvider)()\n], {\n    pollingInterval: 8000\n} // Increase polling interval to reduce load\n);\n// Log connection status when client is created\nconsole.log(\"Creating wagmi client with chains:\", chains);\n// Create wagmi client with improved options\nconst client = (0,wagmi__WEBPACK_IMPORTED_MODULE_3__.createClient)({\n    autoConnect: true,\n    connectors: [\n        new wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_6__.MetaMaskConnector({\n            chains,\n            options: {\n                shimDisconnect: true\n            }\n        }),\n        new wagmi_connectors_coinbaseWallet__WEBPACK_IMPORTED_MODULE_7__.CoinbaseWalletConnector({\n            chains,\n            options: {\n                appName: \"GrowBit\",\n                headlessMode: false,\n                reloadOnDisconnect: false\n            }\n        }),\n        // Additional connector for any injected wallet like Rabby\n        new wagmi_connectors_injected__WEBPACK_IMPORTED_MODULE_8__.InjectedConnector({\n            chains,\n            options: {\n                name: \"Any Wallet\",\n                shimDisconnect: true\n            }\n        })\n    ],\n    provider,\n    webSocketProvider,\n    logger: {\n        warn: (message)=>console.warn(\"Wagmi warning:\", message)\n    }\n});\nfunction MyApp({ Component, pageProps }) {\n    const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(true);\n    // Hydration fix\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        setMounted(true);\n        // Simulate app initialization loading\n        const timer = setTimeout(()=>{\n            setLoading(false);\n        }, 800); // Increased from 600ms to give more time for client setup\n        return ()=>clearTimeout(timer);\n    }, []);\n    if (!mounted) return null;\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                name: \"viewport\",\n                content: \"width=device-width, initial-scale=1.0\"\n            }, void 0, false, {\n                fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                lineNumber: 108,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                name: \"theme-color\",\n                content: \"#3B82F6\"\n            }, void 0, false, {\n                fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                lineNumber: 109,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                name: \"apple-mobile-web-app-capable\",\n                content: \"yes\"\n            }, void 0, false, {\n                fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                lineNumber: 110,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                name: \"apple-mobile-web-app-status-bar-style\",\n                content: \"black-translucent\"\n            }, void 0, false, {\n                fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                lineNumber: 111,\n                columnNumber: 7\n            }, this),\n            loading ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"fixed inset-0 flex items-center justify-center bg-white z-50\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"text-center\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto mb-4\"\n                        }, void 0, false, {\n                            fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                            lineNumber: 116,\n                            columnNumber: 13\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                            className: \"text-xl font-medium text-gray-800\",\n                            children: \"Loading GrowBit\"\n                        }, void 0, false, {\n                            fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                            lineNumber: 117,\n                            columnNumber: 13\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                            className: \"text-gray-500 mt-1\",\n                            children: \"Your growth journey awaits...\"\n                        }, void 0, false, {\n                            fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                            lineNumber: 118,\n                            columnNumber: 13\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                    lineNumber: 115,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                lineNumber: 114,\n                columnNumber: 9\n            }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(wagmi__WEBPACK_IMPORTED_MODULE_3__.WagmiConfig, {\n                client: client,\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                    lineNumber: 123,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                lineNumber: 122,\n                columnNumber: 9\n            }, this)\n        ]\n    }, void 0, true);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0FBVTs7Ozs7O3NDQUNmLDhEQUFDQzs0QkFBR0QsV0FBVTtzQ0FBb0M7Ozs7OztzQ0FDbEQsOERBQUNFOzRCQUFFRixXQUFVO3NDQUFxQjs7Ozs7Ozs7Ozs7Ozs7OztxQ0FJdEMsOERBQUMxRCw4Q0FBV0E7Z0JBQUNrQyxRQUFRQTswQkFDbkIsNEVBQUNZO29CQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7Ozs7QUFLbEM7QUFFQSxpRUFBZUYsS0FBS0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2dyb3diaXQtZnJvbnRlbmQvLi9wYWdlcy9fYXBwLnRzeD8yZmJlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcbmltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCc7XG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgV2FnbWlDb25maWcsIGNyZWF0ZUNsaWVudCwgY29uZmlndXJlQ2hhaW5zIH0gZnJvbSAnd2FnbWknO1xuaW1wb3J0IHsgcHVibGljUHJvdmlkZXIgfSBmcm9tICd3YWdtaS9wcm92aWRlcnMvcHVibGljJztcbmltcG9ydCB7IGpzb25ScGNQcm92aWRlciB9IGZyb20gJ3dhZ21pL3Byb3ZpZGVycy9qc29uUnBjJztcbmltcG9ydCB7IE1ldGFNYXNrQ29ubmVjdG9yIH0gZnJvbSAnd2FnbWkvY29ubmVjdG9ycy9tZXRhTWFzayc7XG5pbXBvcnQgeyBDb2luYmFzZVdhbGxldENvbm5lY3RvciB9IGZyb20gJ3dhZ21pL2Nvbm5lY3RvcnMvY29pbmJhc2VXYWxsZXQnO1xuaW1wb3J0IHsgSW5qZWN0ZWRDb25uZWN0b3IgfSBmcm9tICd3YWdtaS9jb25uZWN0b3JzL2luamVjdGVkJztcbmltcG9ydCB7IENoYWluIH0gZnJvbSAnd2FnbWknO1xuXG4vLyBEZWZpbmUgQmFzZSBTZXBvbGlhIHRlc3RuZXRcbmNvbnN0IGJhc2VTZXBvbGlhOiBDaGFpbiA9IHtcbiAgaWQ6IDg0NTMyLFxuICBuYW1lOiAnQmFzZSBTZXBvbGlhJyxcbiAgbmV0d29yazogJ2Jhc2Utc2Vwb2xpYScsXG4gIG5hdGl2ZUN1cnJlbmN5OiB7XG4gICAgZGVjaW1hbHM6IDE4LFxuICAgIG5hbWU6ICdTZXBvbGlhIEVUSCcsXG4gICAgc3ltYm9sOiAnRVRIJyxcbiAgfSxcbiAgcnBjVXJsczoge1xuICAgIHB1YmxpYzogeyBodHRwOiBbcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQkFTRV9TRVBPTElBX1JQQ19VUkwgfHwgJ2h0dHBzOi8vc2Vwb2xpYS5iYXNlLm9yZyddIH0sXG4gICAgZGVmYXVsdDogeyBodHRwOiBbcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQkFTRV9TRVBPTElBX1JQQ19VUkwgfHwgJ2h0dHBzOi8vc2Vwb2xpYS5iYXNlLm9yZyddIH0sXG4gIH0sXG4gIGJsb2NrRXhwbG9yZXJzOiB7XG4gICAgZGVmYXVsdDogeyBuYW1lOiAnQmFzZVNjYW4nLCB1cmw6ICdodHRwczovL3NlcG9saWEuYmFzZXNjYW4ub3JnJyB9LFxuICB9LFxuICB0ZXN0bmV0OiB0cnVlLFxufTtcblxuLy8gQ29uZmlndXJlIGNoYWlucyAmIHByb3ZpZGVycyB3aXRoIGJldHRlciBmYWxsYmFjayBvcHRpb25zXG5jb25zdCB7IGNoYWlucywgcHJvdmlkZXIsIHdlYlNvY2tldFByb3ZpZGVyIH0gPSBjb25maWd1cmVDaGFpbnMoXG4gIFtiYXNlU2Vwb2xpYV0sXG4gIFtcbiAgICBqc29uUnBjUHJvdmlkZXIoe1xuICAgICAgcnBjOiAoY2hhaW4pID0+IHtcbiAgICAgICAgaWYgKGNoYWluLmlkID09PSBiYXNlU2Vwb2xpYS5pZCkge1xuICAgICAgICAgIC8vIFVzZSBlbnZpcm9ubWVudCB2YXJpYWJsZSBvciBmYWxsYmFja1xuICAgICAgICAgIHJldHVybiB7IGh0dHA6IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0JBU0VfU0VQT0xJQV9SUENfVVJMIHx8ICdodHRwczovL3NlcG9saWEuYmFzZS5vcmcnIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9LFxuICAgICAgcHJpb3JpdHk6IDAsIC8vIEhpZ2hlciBwcmlvcml0eVxuICAgIH0pLFxuICAgIHB1YmxpY1Byb3ZpZGVyKCksXG4gIF0sXG4gIHsgcG9sbGluZ0ludGVydmFsOiA4MDAwIH0gLy8gSW5jcmVhc2UgcG9sbGluZyBpbnRlcnZhbCB0byByZWR1Y2UgbG9hZFxuKTtcblxuLy8gTG9nIGNvbm5lY3Rpb24gc3RhdHVzIHdoZW4gY2xpZW50IGlzIGNyZWF0ZWRcbmNvbnNvbGUubG9nKCdDcmVhdGluZyB3YWdtaSBjbGllbnQgd2l0aCBjaGFpbnM6JywgY2hhaW5zKTtcblxuLy8gQ3JlYXRlIHdhZ21pIGNsaWVudCB3aXRoIGltcHJvdmVkIG9wdGlvbnNcbmNvbnN0IGNsaWVudCA9IGNyZWF0ZUNsaWVudCh7XG4gIGF1dG9Db25uZWN0OiB0cnVlLFxuICBjb25uZWN0b3JzOiBbXG4gICAgbmV3IE1ldGFNYXNrQ29ubmVjdG9yKHsgXG4gICAgICBjaGFpbnMsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIHNoaW1EaXNjb25uZWN0OiB0cnVlLFxuICAgICAgfVxuICAgIH0pLFxuICAgIG5ldyBDb2luYmFzZVdhbGxldENvbm5lY3Rvcih7XG4gICAgICBjaGFpbnMsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGFwcE5hbWU6ICdHcm93Qml0JyxcbiAgICAgICAgaGVhZGxlc3NNb2RlOiBmYWxzZSxcbiAgICAgICAgcmVsb2FkT25EaXNjb25uZWN0OiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgLy8gQWRkaXRpb25hbCBjb25uZWN0b3IgZm9yIGFueSBpbmplY3RlZCB3YWxsZXQgbGlrZSBSYWJieVxuICAgIG5ldyBJbmplY3RlZENvbm5lY3Rvcih7IFxuICAgICAgY2hhaW5zLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBuYW1lOiAnQW55IFdhbGxldCcsXG4gICAgICAgIHNoaW1EaXNjb25uZWN0OiB0cnVlLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgcHJvdmlkZXIsXG4gIHdlYlNvY2tldFByb3ZpZGVyLFxuICBsb2dnZXI6IHtcbiAgICB3YXJuOiAobWVzc2FnZSkgPT4gY29uc29sZS53YXJuKCdXYWdtaSB3YXJuaW5nOicsIG1lc3NhZ2UpLFxuICB9LFxufSk7XG5cbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgY29uc3QgW21vdW50ZWQsIHNldE1vdW50ZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcblxuICAvLyBIeWRyYXRpb24gZml4XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0TW91bnRlZCh0cnVlKTtcbiAgICBcbiAgICAvLyBTaW11bGF0ZSBhcHAgaW5pdGlhbGl6YXRpb24gbG9hZGluZ1xuICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICB9LCA4MDApOyAvLyBJbmNyZWFzZWQgZnJvbSA2MDBtcyB0byBnaXZlIG1vcmUgdGltZSBmb3IgY2xpZW50IHNldHVwXG4gICAgXG4gICAgcmV0dXJuICgpID0+IGNsZWFyVGltZW91dCh0aW1lcik7XG4gIH0sIFtdKTtcblxuICBpZiAoIW1vdW50ZWQpIHJldHVybiBudWxsO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MS4wXCIgLz5cbiAgICAgIDxtZXRhIG5hbWU9XCJ0aGVtZS1jb2xvclwiIGNvbnRlbnQ9XCIjM0I4MkY2XCIgLz5cbiAgICAgIDxtZXRhIG5hbWU9XCJhcHBsZS1tb2JpbGUtd2ViLWFwcC1jYXBhYmxlXCIgY29udGVudD1cInllc1wiIC8+XG4gICAgICA8bWV0YSBuYW1lPVwiYXBwbGUtbW9iaWxlLXdlYi1hcHAtc3RhdHVzLWJhci1zdHlsZVwiIGNvbnRlbnQ9XCJibGFjay10cmFuc2x1Y2VudFwiIC8+XG4gICAgICBcbiAgICAgIHtsb2FkaW5nID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpeGVkIGluc2V0LTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYmctd2hpdGUgei01MFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xNiBoLTE2IGJvcmRlci10LTQgYm9yZGVyLWItNCBib3JkZXItYmx1ZS01MDAgcm91bmRlZC1mdWxsIGFuaW1hdGUtc3BpbiBteC1hdXRvIG1iLTRcIj48L2Rpdj5cbiAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJ0ZXh0LXhsIGZvbnQtbWVkaXVtIHRleHQtZ3JheS04MDBcIj5Mb2FkaW5nIEdyb3dCaXQ8L2gyPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTUwMCBtdC0xXCI+WW91ciBncm93dGggam91cm5leSBhd2FpdHMuLi48L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IChcbiAgICAgICAgPFdhZ21pQ29uZmlnIGNsaWVudD17Y2xpZW50fT5cbiAgICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICAgIDwvV2FnbWlDb25maWc+XG4gICAgICApfVxuICAgIDwvPlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBNeUFwcDsgIl0sIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiV2FnbWlDb25maWciLCJjcmVhdGVDbGllbnQiLCJjb25maWd1cmVDaGFpbnMiLCJwdWJsaWNQcm92aWRlciIsImpzb25ScGNQcm92aWRlciIsIk1ldGFNYXNrQ29ubmVjdG9yIiwiQ29pbmJhc2VXYWxsZXRDb25uZWN0b3IiLCJJbmplY3RlZENvbm5lY3RvciIsImJhc2VTZXBvbGlhIiwiaWQiLCJuYW1lIiwibmV0d29yayIsIm5hdGl2ZUN1cnJlbmN5IiwiZGVjaW1hbHMiLCJzeW1ib2wiLCJycGNVcmxzIiwicHVibGljIiwiaHR0cCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19CQVNFX1NFUE9MSUFfUlBDX1VSTCIsImRlZmF1bHQiLCJibG9ja0V4cGxvcmVycyIsInVybCIsInRlc3RuZXQiLCJjaGFpbnMiLCJwcm92aWRlciIsIndlYlNvY2tldFByb3ZpZGVyIiwicnBjIiwiY2hhaW4iLCJwcmlvcml0eSIsInBvbGxpbmdJbnRlcnZhbCIsImNvbnNvbGUiLCJsb2ciLCJjbGllbnQiLCJhdXRvQ29ubmVjdCIsImNvbm5lY3RvcnMiLCJvcHRpb25zIiwic2hpbURpc2Nvbm5lY3QiLCJhcHBOYW1lIiwiaGVhZGxlc3NNb2RlIiwicmVsb2FkT25EaXNjb25uZWN0IiwibG9nZ2VyIiwid2FybiIsIm1lc3NhZ2UiLCJNeUFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsIm1vdW50ZWQiLCJzZXRNb3VudGVkIiwibG9hZGluZyIsInNldExvYWRpbmciLCJ0aW1lciIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJtZXRhIiwiY29udGVudCIsImRpdiIsImNsYXNzTmFtZSIsImgyIiwicCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "wagmi":
/*!************************!*\
  !*** external "wagmi" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi");;

/***/ }),

/***/ "wagmi/connectors/coinbaseWallet":
/*!**************************************************!*\
  !*** external "wagmi/connectors/coinbaseWallet" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/connectors/coinbaseWallet");;

/***/ }),

/***/ "wagmi/connectors/injected":
/*!********************************************!*\
  !*** external "wagmi/connectors/injected" ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/connectors/injected");;

/***/ }),

/***/ "wagmi/connectors/metaMask":
/*!********************************************!*\
  !*** external "wagmi/connectors/metaMask" ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/connectors/metaMask");;

/***/ }),

/***/ "wagmi/providers/jsonRpc":
/*!******************************************!*\
  !*** external "wagmi/providers/jsonRpc" ***!
  \******************************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/providers/jsonRpc");;

/***/ }),

/***/ "wagmi/providers/public":
/*!*****************************************!*\
  !*** external "wagmi/providers/public" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/providers/public");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();