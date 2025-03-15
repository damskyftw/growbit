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
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var wagmi_providers_public__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! wagmi/providers/public */ \"wagmi/providers/public\");\n/* harmony import */ var wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! wagmi/connectors/metaMask */ \"wagmi/connectors/metaMask\");\n/* harmony import */ var wagmi_connectors_walletConnect__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! wagmi/connectors/walletConnect */ \"wagmi/connectors/walletConnect\");\n/* harmony import */ var wagmi_connectors_coinbaseWallet__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! wagmi/connectors/coinbaseWallet */ \"wagmi/connectors/coinbaseWallet\");\n/* harmony import */ var wagmi_connectors_injected__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! wagmi/connectors/injected */ \"wagmi/connectors/injected\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([wagmi__WEBPACK_IMPORTED_MODULE_3__, wagmi_providers_public__WEBPACK_IMPORTED_MODULE_4__, wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_5__, wagmi_connectors_walletConnect__WEBPACK_IMPORTED_MODULE_6__, wagmi_connectors_coinbaseWallet__WEBPACK_IMPORTED_MODULE_7__, wagmi_connectors_injected__WEBPACK_IMPORTED_MODULE_8__]);\n([wagmi__WEBPACK_IMPORTED_MODULE_3__, wagmi_providers_public__WEBPACK_IMPORTED_MODULE_4__, wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_5__, wagmi_connectors_walletConnect__WEBPACK_IMPORTED_MODULE_6__, wagmi_connectors_coinbaseWallet__WEBPACK_IMPORTED_MODULE_7__, wagmi_connectors_injected__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\n\n\n// Define Base Sepolia testnet\nconst baseSepolia = {\n    id: 84532,\n    name: \"Base Sepolia\",\n    network: \"base-sepolia\",\n    nativeCurrency: {\n        decimals: 18,\n        name: \"Sepolia ETH\",\n        symbol: \"ETH\"\n    },\n    rpcUrls: {\n        public: {\n            http: [\n                \"https://sepolia.base.org\"\n            ]\n        },\n        default: {\n            http: [\n                \"https://sepolia.base.org\"\n            ]\n        }\n    },\n    blockExplorers: {\n        default: {\n            name: \"BaseScan\",\n            url: \"https://sepolia.basescan.org\"\n        }\n    },\n    testnet: true\n};\n// Configure chains & providers\nconst { chains, provider, webSocketProvider } = (0,wagmi__WEBPACK_IMPORTED_MODULE_3__.configureChains)([\n    baseSepolia\n], [\n    (0,wagmi_providers_public__WEBPACK_IMPORTED_MODULE_4__.publicProvider)()\n]);\n// Set up wagmi config\nconst client = (0,wagmi__WEBPACK_IMPORTED_MODULE_3__.createClient)({\n    autoConnect: true,\n    connectors: [\n        new wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_5__.MetaMaskConnector({\n            chains\n        }),\n        new wagmi_connectors_coinbaseWallet__WEBPACK_IMPORTED_MODULE_7__.CoinbaseWalletConnector({\n            chains,\n            options: {\n                appName: \"GrowBit\"\n            }\n        }),\n        new wagmi_connectors_walletConnect__WEBPACK_IMPORTED_MODULE_6__.WalletConnectConnector({\n            chains,\n            options: {\n                projectId: \"3f767837ee334febbfd764b0b6b796e8\"\n            }\n        }),\n        // Additional connector for any injected wallet like Rabby\n        new wagmi_connectors_injected__WEBPACK_IMPORTED_MODULE_8__.InjectedConnector({\n            chains,\n            options: {\n                name: \"Any Wallet\",\n                shimDisconnect: true\n            }\n        })\n    ],\n    provider,\n    webSocketProvider\n});\nfunction MyApp({ Component, pageProps }) {\n    const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(true);\n    // Hydration fix\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        setMounted(true);\n        // Simulate app initialization loading\n        const timer = setTimeout(()=>{\n            setLoading(false);\n        }, 600);\n        return ()=>clearTimeout(timer);\n    }, []);\n    if (!mounted) return null;\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                name: \"viewport\",\n                content: \"width=device-width, initial-scale=1.0\"\n            }, void 0, false, {\n                fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                lineNumber: 89,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                name: \"theme-color\",\n                content: \"#3B82F6\"\n            }, void 0, false, {\n                fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                lineNumber: 90,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                name: \"apple-mobile-web-app-capable\",\n                content: \"yes\"\n            }, void 0, false, {\n                fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                lineNumber: 91,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                name: \"apple-mobile-web-app-status-bar-style\",\n                content: \"black-translucent\"\n            }, void 0, false, {\n                fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                lineNumber: 92,\n                columnNumber: 7\n            }, this),\n            loading ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"fixed inset-0 flex items-center justify-center bg-white z-50\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"text-center\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto mb-4\"\n                        }, void 0, false, {\n                            fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                            lineNumber: 97,\n                            columnNumber: 13\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                            className: \"text-xl font-medium text-gray-800\",\n                            children: \"Loading GrowBit\"\n                        }, void 0, false, {\n                            fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                            lineNumber: 98,\n                            columnNumber: 13\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                            className: \"text-gray-500 mt-1\",\n                            children: \"Your growth journey awaits...\"\n                        }, void 0, false, {\n                            fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                            lineNumber: 99,\n                            columnNumber: 13\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                    lineNumber: 96,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                lineNumber: 95,\n                columnNumber: 9\n            }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(wagmi__WEBPACK_IMPORTED_MODULE_3__.WagmiConfig, {\n                client: client,\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                    lineNumber: 104,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/damsky/growbit/frontend-app/pages/_app.tsx\",\n                lineNumber: 103,\n                columnNumber: 9\n            }, this)\n        ]\n    }, void 0, true);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUErQjtBQUVhO0FBQ3VCO0FBQ1g7QUFDTTtBQUNVO0FBQ0U7QUFDWjtBQUc5RCw4QkFBOEI7QUFDOUIsTUFBTVUsY0FBcUI7SUFDekJDLElBQUk7SUFDSkMsTUFBTTtJQUNOQyxTQUFTO0lBQ1RDLGdCQUFnQjtRQUNkQyxVQUFVO1FBQ1ZILE1BQU07UUFDTkksUUFBUTtJQUNWO0lBQ0FDLFNBQVM7UUFDUEMsUUFBUTtZQUFFQyxNQUFNO2dCQUFDO2FBQTJCO1FBQUM7UUFDN0NDLFNBQVM7WUFBRUQsTUFBTTtnQkFBQzthQUEyQjtRQUFDO0lBQ2hEO0lBQ0FFLGdCQUFnQjtRQUNkRCxTQUFTO1lBQUVSLE1BQU07WUFBWVUsS0FBSztRQUErQjtJQUNuRTtJQUNBQyxTQUFTO0FBQ1g7QUFFQSwrQkFBK0I7QUFDL0IsTUFBTSxFQUFFQyxNQUFNLEVBQUVDLFFBQVEsRUFBRUMsaUJBQWlCLEVBQUUsR0FBR3RCLHNEQUFlQSxDQUM3RDtJQUFDTTtDQUFZLEVBQ2I7SUFBQ0wsc0VBQWNBO0NBQUc7QUFHcEIsc0JBQXNCO0FBQ3RCLE1BQU1zQixTQUFTeEIsbURBQVlBLENBQUM7SUFDMUJ5QixhQUFhO0lBQ2JDLFlBQVk7UUFDVixJQUFJdkIsd0VBQWlCQSxDQUFDO1lBQUVrQjtRQUFPO1FBQy9CLElBQUloQixvRkFBdUJBLENBQUM7WUFDMUJnQjtZQUNBTSxTQUFTO2dCQUNQQyxTQUFTO1lBRVg7UUFDRjtRQUNBLElBQUl4QixrRkFBc0JBLENBQUM7WUFDekJpQjtZQUNBTSxTQUFTO2dCQUNQRSxXQUFXO1lBQ2I7UUFDRjtRQUNBLDBEQUEwRDtRQUMxRCxJQUFJdkIsd0VBQWlCQSxDQUFDO1lBQ3BCZTtZQUNBTSxTQUFTO2dCQUNQbEIsTUFBTTtnQkFDTnFCLGdCQUFnQjtZQUNsQjtRQUNGO0tBQ0Q7SUFDRFI7SUFDQUM7QUFDRjtBQUVBLFNBQVNRLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDL0MsTUFBTSxDQUFDQyxTQUFTQyxXQUFXLEdBQUd0QywrQ0FBUUEsQ0FBQztJQUN2QyxNQUFNLENBQUN1QyxTQUFTQyxXQUFXLEdBQUd4QywrQ0FBUUEsQ0FBQztJQUV2QyxnQkFBZ0I7SUFDaEJDLGdEQUFTQSxDQUFDO1FBQ1JxQyxXQUFXO1FBRVgsc0NBQXNDO1FBQ3RDLE1BQU1HLFFBQVFDLFdBQVc7WUFDdkJGLFdBQVc7UUFDYixHQUFHO1FBRUgsT0FBTyxJQUFNRyxhQUFhRjtJQUM1QixHQUFHLEVBQUU7SUFFTCxJQUFJLENBQUNKLFNBQVMsT0FBTztJQUVyQixxQkFDRTs7MEJBQ0UsOERBQUNPO2dCQUFLaEMsTUFBSztnQkFBV2lDLFNBQVE7Ozs7OzswQkFDOUIsOERBQUNEO2dCQUFLaEMsTUFBSztnQkFBY2lDLFNBQVE7Ozs7OzswQkFDakMsOERBQUNEO2dCQUFLaEMsTUFBSztnQkFBK0JpQyxTQUFROzs7Ozs7MEJBQ2xELDhEQUFDRDtnQkFBS2hDLE1BQUs7Z0JBQXdDaUMsU0FBUTs7Ozs7O1lBRTFETix3QkFDQyw4REFBQ087Z0JBQUlDLFdBQVU7MEJBQ2IsNEVBQUNEO29CQUFJQyxXQUFVOztzQ0FDYiw4REFBQ0Q7NEJBQUlDLFdBQVU7Ozs7OztzQ0FDZiw4REFBQ0M7NEJBQUdELFdBQVU7c0NBQW9DOzs7Ozs7c0NBQ2xELDhEQUFDRTs0QkFBRUYsV0FBVTtzQ0FBcUI7Ozs7Ozs7Ozs7Ozs7Ozs7cUNBSXRDLDhEQUFDN0MsOENBQVdBO2dCQUFDeUIsUUFBUUE7MEJBQ25CLDRFQUFDUTtvQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7O0FBS2xDO0FBRUEsaUVBQWVGLEtBQUtBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ncm93Yml0LWZyb250ZW5kLy4vcGFnZXMvX2FwcC50c3g/MmZiZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4uL3N0eWxlcy9nbG9iYWxzLmNzcyc7XG5pbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSAnbmV4dC9hcHAnO1xuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFdhZ21pQ29uZmlnLCBjcmVhdGVDbGllbnQsIGNvbmZpZ3VyZUNoYWlucyB9IGZyb20gJ3dhZ21pJztcbmltcG9ydCB7IHB1YmxpY1Byb3ZpZGVyIH0gZnJvbSAnd2FnbWkvcHJvdmlkZXJzL3B1YmxpYyc7XG5pbXBvcnQgeyBNZXRhTWFza0Nvbm5lY3RvciB9IGZyb20gJ3dhZ21pL2Nvbm5lY3RvcnMvbWV0YU1hc2snO1xuaW1wb3J0IHsgV2FsbGV0Q29ubmVjdENvbm5lY3RvciB9IGZyb20gJ3dhZ21pL2Nvbm5lY3RvcnMvd2FsbGV0Q29ubmVjdCc7XG5pbXBvcnQgeyBDb2luYmFzZVdhbGxldENvbm5lY3RvciB9IGZyb20gJ3dhZ21pL2Nvbm5lY3RvcnMvY29pbmJhc2VXYWxsZXQnO1xuaW1wb3J0IHsgSW5qZWN0ZWRDb25uZWN0b3IgfSBmcm9tICd3YWdtaS9jb25uZWN0b3JzL2luamVjdGVkJztcbmltcG9ydCB7IENoYWluIH0gZnJvbSAnd2FnbWknO1xuXG4vLyBEZWZpbmUgQmFzZSBTZXBvbGlhIHRlc3RuZXRcbmNvbnN0IGJhc2VTZXBvbGlhOiBDaGFpbiA9IHtcbiAgaWQ6IDg0NTMyLFxuICBuYW1lOiAnQmFzZSBTZXBvbGlhJyxcbiAgbmV0d29yazogJ2Jhc2Utc2Vwb2xpYScsXG4gIG5hdGl2ZUN1cnJlbmN5OiB7XG4gICAgZGVjaW1hbHM6IDE4LFxuICAgIG5hbWU6ICdTZXBvbGlhIEVUSCcsXG4gICAgc3ltYm9sOiAnRVRIJyxcbiAgfSxcbiAgcnBjVXJsczoge1xuICAgIHB1YmxpYzogeyBodHRwOiBbJ2h0dHBzOi8vc2Vwb2xpYS5iYXNlLm9yZyddIH0sXG4gICAgZGVmYXVsdDogeyBodHRwOiBbJ2h0dHBzOi8vc2Vwb2xpYS5iYXNlLm9yZyddIH0sXG4gIH0sXG4gIGJsb2NrRXhwbG9yZXJzOiB7XG4gICAgZGVmYXVsdDogeyBuYW1lOiAnQmFzZVNjYW4nLCB1cmw6ICdodHRwczovL3NlcG9saWEuYmFzZXNjYW4ub3JnJyB9LFxuICB9LFxuICB0ZXN0bmV0OiB0cnVlLFxufTtcblxuLy8gQ29uZmlndXJlIGNoYWlucyAmIHByb3ZpZGVyc1xuY29uc3QgeyBjaGFpbnMsIHByb3ZpZGVyLCB3ZWJTb2NrZXRQcm92aWRlciB9ID0gY29uZmlndXJlQ2hhaW5zKFxuICBbYmFzZVNlcG9saWFdLFxuICBbcHVibGljUHJvdmlkZXIoKV1cbik7XG5cbi8vIFNldCB1cCB3YWdtaSBjb25maWdcbmNvbnN0IGNsaWVudCA9IGNyZWF0ZUNsaWVudCh7XG4gIGF1dG9Db25uZWN0OiB0cnVlLFxuICBjb25uZWN0b3JzOiBbXG4gICAgbmV3IE1ldGFNYXNrQ29ubmVjdG9yKHsgY2hhaW5zIH0pLFxuICAgIG5ldyBDb2luYmFzZVdhbGxldENvbm5lY3Rvcih7XG4gICAgICBjaGFpbnMsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGFwcE5hbWU6ICdHcm93Qml0JyxcbiAgICAgICAgLy8gU21hcnQgd2FsbGV0IGZlYXR1cmVzIGFyZSBhdXRvLWVuYWJsZWQgd2hlbiB1c2luZyBDb2luYmFzZSBXYWxsZXQgb24gQmFzZVxuICAgICAgfSxcbiAgICB9KSxcbiAgICBuZXcgV2FsbGV0Q29ubmVjdENvbm5lY3Rvcih7XG4gICAgICBjaGFpbnMsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIHByb2plY3RJZDogJzNmNzY3ODM3ZWUzMzRmZWJiZmQ3NjRiMGI2Yjc5NmU4JyxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgLy8gQWRkaXRpb25hbCBjb25uZWN0b3IgZm9yIGFueSBpbmplY3RlZCB3YWxsZXQgbGlrZSBSYWJieVxuICAgIG5ldyBJbmplY3RlZENvbm5lY3Rvcih7IFxuICAgICAgY2hhaW5zLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBuYW1lOiAnQW55IFdhbGxldCcsXG4gICAgICAgIHNoaW1EaXNjb25uZWN0OiB0cnVlLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgcHJvdmlkZXIsXG4gIHdlYlNvY2tldFByb3ZpZGVyLFxufSk7XG5cbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgY29uc3QgW21vdW50ZWQsIHNldE1vdW50ZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcblxuICAvLyBIeWRyYXRpb24gZml4XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0TW91bnRlZCh0cnVlKTtcbiAgICBcbiAgICAvLyBTaW11bGF0ZSBhcHAgaW5pdGlhbGl6YXRpb24gbG9hZGluZ1xuICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICB9LCA2MDApO1xuICAgIFxuICAgIHJldHVybiAoKSA9PiBjbGVhclRpbWVvdXQodGltZXIpO1xuICB9LCBbXSk7XG5cbiAgaWYgKCFtb3VudGVkKSByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMFwiIC8+XG4gICAgICA8bWV0YSBuYW1lPVwidGhlbWUtY29sb3JcIiBjb250ZW50PVwiIzNCODJGNlwiIC8+XG4gICAgICA8bWV0YSBuYW1lPVwiYXBwbGUtbW9iaWxlLXdlYi1hcHAtY2FwYWJsZVwiIGNvbnRlbnQ9XCJ5ZXNcIiAvPlxuICAgICAgPG1ldGEgbmFtZT1cImFwcGxlLW1vYmlsZS13ZWItYXBwLXN0YXR1cy1iYXItc3R5bGVcIiBjb250ZW50PVwiYmxhY2stdHJhbnNsdWNlbnRcIiAvPlxuICAgICAgXG4gICAgICB7bG9hZGluZyA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC0wIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGJnLXdoaXRlIHotNTBcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMTYgaC0xNiBib3JkZXItdC00IGJvcmRlci1iLTQgYm9yZGVyLWJsdWUtNTAwIHJvdW5kZWQtZnVsbCBhbmltYXRlLXNwaW4gbXgtYXV0byBtYi00XCI+PC9kaXY+XG4gICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGV4dC14bCBmb250LW1lZGl1bSB0ZXh0LWdyYXktODAwXCI+TG9hZGluZyBHcm93Qml0PC9oMj5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtZ3JheS01MDAgbXQtMVwiPllvdXIgZ3Jvd3RoIGpvdXJuZXkgYXdhaXRzLi4uPC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiAoXG4gICAgICAgIDxXYWdtaUNvbmZpZyBjbGllbnQ9e2NsaWVudH0+XG4gICAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgICA8L1dhZ21pQ29uZmlnPlxuICAgICAgKX1cbiAgICA8Lz5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTXlBcHA7ICJdLCJuYW1lcyI6WyJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsIldhZ21pQ29uZmlnIiwiY3JlYXRlQ2xpZW50IiwiY29uZmlndXJlQ2hhaW5zIiwicHVibGljUHJvdmlkZXIiLCJNZXRhTWFza0Nvbm5lY3RvciIsIldhbGxldENvbm5lY3RDb25uZWN0b3IiLCJDb2luYmFzZVdhbGxldENvbm5lY3RvciIsIkluamVjdGVkQ29ubmVjdG9yIiwiYmFzZVNlcG9saWEiLCJpZCIsIm5hbWUiLCJuZXR3b3JrIiwibmF0aXZlQ3VycmVuY3kiLCJkZWNpbWFscyIsInN5bWJvbCIsInJwY1VybHMiLCJwdWJsaWMiLCJodHRwIiwiZGVmYXVsdCIsImJsb2NrRXhwbG9yZXJzIiwidXJsIiwidGVzdG5ldCIsImNoYWlucyIsInByb3ZpZGVyIiwid2ViU29ja2V0UHJvdmlkZXIiLCJjbGllbnQiLCJhdXRvQ29ubmVjdCIsImNvbm5lY3RvcnMiLCJvcHRpb25zIiwiYXBwTmFtZSIsInByb2plY3RJZCIsInNoaW1EaXNjb25uZWN0IiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJtb3VudGVkIiwic2V0TW91bnRlZCIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwidGltZXIiLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwibWV0YSIsImNvbnRlbnQiLCJkaXYiLCJjbGFzc05hbWUiLCJoMiIsInAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

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

/***/ "wagmi/connectors/walletConnect":
/*!*************************************************!*\
  !*** external "wagmi/connectors/walletConnect" ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/connectors/walletConnect");;

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