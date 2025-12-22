module.exports = [
"[project]/components/AdminGuide.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminGuide
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Info$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Info.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$X$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/X.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CheckCircle$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/CheckCircle.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Warning$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Warning.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Lightbulb$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Lightbulb.es.js [app-ssr] (ecmascript)");
'use client';
;
;
;
function AdminGuide({ title, description, steps, tips }) {
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const getIcon = (type)=>{
        switch(type){
            case 'warning':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Warning$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Warning"], {
                    size: 20,
                    className: "text-amber-600",
                    weight: "fill"
                }, void 0, false, {
                    fileName: "[project]/components/AdminGuide.tsx",
                    lineNumber: 25,
                    columnNumber: 24
                }, this);
            case 'tip':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Lightbulb$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Lightbulb"], {
                    size: 20,
                    className: "text-yellow-600",
                    weight: "fill"
                }, void 0, false, {
                    fileName: "[project]/components/AdminGuide.tsx",
                    lineNumber: 27,
                    columnNumber: 24
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CheckCircle$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckCircle"], {
                    size: 20,
                    className: "text-blue-600",
                    weight: "fill"
                }, void 0, false, {
                    fileName: "[project]/components/AdminGuide.tsx",
                    lineNumber: 29,
                    columnNumber: 24
                }, this);
        }
    };
    const getColor = (type)=>{
        switch(type){
            case 'warning':
                return 'bg-amber-50 border-amber-200';
            case 'tip':
                return 'bg-yellow-50 border-yellow-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsOpen(true),
                className: "fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-2xl hover:bg-blue-700 transition-all hover:scale-110 z-40 flex items-center gap-2 group",
                title: "Ver Guía de Ayuda",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Info$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Info"], {
                        size: 24,
                        weight: "fill"
                    }, void 0, false, {
                        fileName: "[project]/components/AdminGuide.tsx",
                        lineNumber: 52,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold",
                        children: "Guía de Ayuda"
                    }, void 0, false, {
                        fileName: "[project]/components/AdminGuide.tsx",
                        lineNumber: 53,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AdminGuide.tsx",
                lineNumber: 47,
                columnNumber: 13
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideUp",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-3 bg-white/20 rounded-lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Info$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Info"], {
                                                size: 32,
                                                weight: "fill"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AdminGuide.tsx",
                                                lineNumber: 66,
                                                columnNumber: 37
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/AdminGuide.tsx",
                                            lineNumber: 65,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-2xl font-bold",
                                                    children: title
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AdminGuide.tsx",
                                                    lineNumber: 69,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-blue-100 text-sm mt-1",
                                                    children: description
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AdminGuide.tsx",
                                                    lineNumber: 70,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/AdminGuide.tsx",
                                            lineNumber: 68,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AdminGuide.tsx",
                                    lineNumber: 64,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setIsOpen(false),
                                    className: "p-2 hover:bg-white/20 rounded-lg transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$X$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["X"], {
                                        size: 24,
                                        weight: "bold"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AdminGuide.tsx",
                                        lineNumber: 77,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/AdminGuide.tsx",
                                    lineNumber: 73,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AdminGuide.tsx",
                            lineNumber: 63,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto p-6 space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-bold text-slate-800 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CheckCircle$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckCircle"], {
                                                    size: 24,
                                                    className: "text-green-600",
                                                    weight: "fill"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AdminGuide.tsx",
                                                    lineNumber: 86,
                                                    columnNumber: 37
                                                }, this),
                                                "Pasos a Seguir"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/AdminGuide.tsx",
                                            lineNumber: 85,
                                            columnNumber: 33
                                        }, this),
                                        steps.map((step, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `border rounded-lg p-4 ${getColor(step.type)}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-slate-700 shadow-sm",
                                                            children: index + 1
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AdminGuide.tsx",
                                                            lineNumber: 95,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2 mb-2",
                                                                    children: [
                                                                        getIcon(step.type),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                            className: "font-bold text-slate-800",
                                                                            children: step.title
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/AdminGuide.tsx",
                                                                            lineNumber: 101,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/AdminGuide.tsx",
                                                                    lineNumber: 99,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-slate-700 leading-relaxed",
                                                                    children: step.description
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/AdminGuide.tsx",
                                                                    lineNumber: 103,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/AdminGuide.tsx",
                                                            lineNumber: 98,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/AdminGuide.tsx",
                                                    lineNumber: 94,
                                                    columnNumber: 41
                                                }, this)
                                            }, index, false, {
                                                fileName: "[project]/components/AdminGuide.tsx",
                                                lineNumber: 90,
                                                columnNumber: 37
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AdminGuide.tsx",
                                    lineNumber: 84,
                                    columnNumber: 29
                                }, this),
                                tips && tips.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-bold text-purple-900 flex items-center gap-2 mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Lightbulb$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Lightbulb"], {
                                                    size: 24,
                                                    className: "text-purple-600",
                                                    weight: "fill"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AdminGuide.tsx",
                                                    lineNumber: 116,
                                                    columnNumber: 41
                                                }, this),
                                                "Consejos Útiles"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/AdminGuide.tsx",
                                            lineNumber: 115,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-3",
                                            children: tips.map((tip, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AdminGuide.tsx",
                                                            lineNumber: 122,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-purple-900 leading-relaxed",
                                                            children: tip
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AdminGuide.tsx",
                                                            lineNumber: 123,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, index, true, {
                                                    fileName: "[project]/components/AdminGuide.tsx",
                                                    lineNumber: 121,
                                                    columnNumber: 45
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/AdminGuide.tsx",
                                            lineNumber: 119,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AdminGuide.tsx",
                                    lineNumber: 114,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-slate-50 border border-slate-200 rounded-lg p-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-slate-600 text-center",
                                        children: [
                                            "💡 ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Nota:"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AdminGuide.tsx",
                                                lineNumber: 133,
                                                columnNumber: 40
                                            }, this),
                                            " Si necesitas ayuda adicional, contacta al equipo de soporte técnico."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AdminGuide.tsx",
                                        lineNumber: 132,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/AdminGuide.tsx",
                                    lineNumber: 131,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AdminGuide.tsx",
                            lineNumber: 82,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t border-slate-200 p-4 bg-slate-50 flex justify-end",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsOpen(false),
                                className: "px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors",
                                children: "Entendido"
                            }, void 0, false, {
                                fileName: "[project]/components/AdminGuide.tsx",
                                lineNumber: 140,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/AdminGuide.tsx",
                            lineNumber: 139,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/AdminGuide.tsx",
                    lineNumber: 61,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/AdminGuide.tsx",
                lineNumber: 60,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/lib/adminGuides.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminGeneralGuide",
    ()=>adminGeneralGuide,
    "communicationsGuide",
    ()=>communicationsGuide,
    "rolesGuide",
    ()=>rolesGuide,
    "storageDashboardGuide",
    ()=>storageDashboardGuide,
    "storageGuide",
    ()=>storageGuide,
    "technicalSettingsGuide",
    ()=>technicalSettingsGuide,
    "unitsGuide",
    ()=>unitsGuide,
    "usersGuide",
    ()=>usersGuide
]);
const adminGeneralGuide = {
    title: 'Configuracion General',
    description: 'Configure la apariencia y marca de su organizacion en la plataforma.',
    steps: [
        'Suba el logo de su organizacion',
        'Configure los colores primario y de acento',
        'Personalice el titulo de la aplicacion',
        'Configure el idioma y zona horaria predeterminados'
    ],
    tips: [
        'Use colores que representen la identidad de su marca',
        'El logo se mostrara en el menu lateral y pantalla de inicio'
    ]
};
const usersGuide = {
    title: 'Gestion de Usuarios',
    description: 'Administre los usuarios de su organizacion, sus roles y permisos.',
    steps: [
        'Haga clic en "Nuevo Usuario" para agregar un usuario',
        'Complete el formulario con los datos del usuario',
        'Seleccione el rol y nivel de acceso apropiado',
        'El usuario recibira una invitacion por correo electronico'
    ],
    tips: [
        'Puede importar usuarios masivamente usando un archivo CSV',
        'Los usuarios inactivos pueden ser suspendidos sin eliminarlos'
    ]
};
const unitsGuide = {
    title: 'Estructura Organizacional',
    description: 'Define la estructura jerarquica de su organizacion.',
    steps: [
        'Cree unidades principales primero (departamentos, areas)',
        'Agregue subunidades segun sea necesario',
        'Asigne responsables a cada unidad',
        'Configure los permisos por nivel'
    ],
    tips: [
        'Una estructura bien definida facilita la gestion de permisos',
        'Las unidades pueden representar departamentos, equipos o procesos'
    ]
};
const rolesGuide = {
    title: 'Roles y Permisos',
    description: 'Configure los permisos para cada nivel de usuario.',
    steps: [
        'Seleccione el nivel que desea configurar',
        'Active o desactive los permisos correspondientes',
        'Los cambios se aplicaran inmediatamente a los usuarios de ese nivel'
    ],
    tips: [
        'El nivel 1 (Admin) tiene todos los permisos por defecto',
        'Sea conservador al asignar permisos de eliminacion'
    ]
};
const storageGuide = {
    title: 'Configuracion de Almacenamiento',
    description: 'Configure el proveedor de almacenamiento para sus documentos.',
    steps: [
        'Seleccione el proveedor de almacenamiento',
        'Ingrese las credenciales de configuracion',
        'Pruebe la conexion antes de guardar',
        'Active el proveedor cuando este listo'
    ],
    tips: [
        'Google Drive y OneDrive requieren configuracion OAuth',
        'S3 es recomendado para grandes volumenes de archivos'
    ]
};
const storageDashboardGuide = {
    title: 'Panel de Almacenamiento',
    description: 'Monitoree el uso de almacenamiento de su organizacion.',
    steps: [
        'Revise el uso total y disponible',
        'Identifique los archivos mas grandes',
        'Configure alertas de uso si es necesario'
    ],
    tips: [
        'Realice limpiezas periodicas de archivos obsoletos',
        'Considere archivar documentos antiguos'
    ]
};
const communicationsGuide = {
    title: 'Comunicaciones',
    description: 'Gestione las publicaciones y anuncios de su organizacion.',
    steps: [
        'Cree una nueva publicacion haciendo clic en "Nueva Publicacion"',
        'Seleccione la audiencia objetivo',
        'Agregue contenido multimedia si es necesario',
        'Publique o guarde como borrador'
    ],
    tips: [
        'Las publicaciones importantes pueden destacarse',
        'Programe publicaciones para fechas futuras'
    ]
};
const technicalSettingsGuide = {
    title: 'Configuracion Tecnica',
    description: 'Configure integraciones y parametros tecnicos de la plataforma.',
    steps: [
        'Configure las integraciones SSO si aplica',
        'Establezca las politicas de seguridad',
        'Configure los webhooks necesarios'
    ],
    tips: [
        'SSO simplifica el inicio de sesion para sus usuarios',
        'Las integraciones mejoran la productividad'
    ]
};
}),
"[project]/lib/config/storageProviderPresets.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getStorageProviderPreset",
    ()=>getStorageProviderPreset,
    "storageProviderPresets",
    ()=>storageProviderPresets
]);
const storageProviderPresets = [
    {
        id: 'GOOGLE_DRIVE',
        label: 'Google Drive',
        icon: 'GoogleDriveLogo',
        description: 'Almacenamiento en la nube de Google',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        instructions: {
            title: 'Configurar Google Drive API',
            steps: [
                'Ve a Google Cloud Console (console.cloud.google.com)',
                'Crea un nuevo proyecto o selecciona uno existente',
                'Habilita la API de Google Drive',
                'Ve a "Credenciales" y crea credenciales OAuth 2.0',
                'Configura la pantalla de consentimiento OAuth',
                'Descarga el archivo JSON de credenciales',
                'Genera un Refresh Token usando OAuth Playground'
            ],
            warning: 'Asegúrate de que la cuenta de servicio tenga permisos de escritura en la carpeta de Drive.',
            links: [
                {
                    label: 'Google Cloud Console',
                    url: 'https://console.cloud.google.com/'
                },
                {
                    label: 'OAuth Playground',
                    url: 'https://developers.google.com/oauthplayground/'
                },
                {
                    label: 'Documentación API',
                    url: 'https://developers.google.com/drive/api/v3/about-sdk'
                }
            ]
        },
        fields: [
            {
                id: 'clientId',
                label: 'Client ID',
                type: 'text',
                placeholder: '123456789-abcdefg.apps.googleusercontent.com',
                required: true
            },
            {
                id: 'clientSecret',
                label: 'Client Secret',
                type: 'password',
                placeholder: 'GOCSPX-xxxxxxxxxxxxxxxxxxxxx',
                required: true
            },
            {
                id: 'refreshToken',
                label: 'Refresh Token',
                type: 'password',
                placeholder: '1//xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                required: true
            },
            {
                id: 'folderId',
                label: 'Folder ID (Opcional)',
                type: 'text',
                placeholder: '1AbCdEfGhIjKlMnOpQrStUvWxYz',
                hint: 'ID de la carpeta raíz donde se almacenarán todos los documentos',
                required: false
            }
        ]
    },
    {
        id: 'DROPBOX',
        label: 'Dropbox',
        icon: 'DropboxLogo',
        description: 'Almacenamiento en la nube de Dropbox',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50',
        instructions: {
            title: 'Configurar Dropbox API',
            steps: [
                'Ve a Dropbox App Console (www.dropbox.com/developers/apps)',
                'Crea una nueva aplicación',
                'Selecciona "Scoped access" y "Full Dropbox"',
                'En Permissions, habilita files.content.write y files.content.read',
                'Genera un Access Token con permisos de larga duración'
            ],
            warning: 'Los tokens de acceso expiran. Considera usar OAuth con refresh tokens para producción.',
            links: [
                {
                    label: 'Dropbox App Console',
                    url: 'https://www.dropbox.com/developers/apps'
                },
                {
                    label: 'Documentación API',
                    url: 'https://www.dropbox.com/developers/documentation/http/documentation'
                }
            ]
        },
        fields: [
            {
                id: 'accessToken',
                label: 'Access Token',
                type: 'password',
                placeholder: 'sl.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                required: true
            },
            {
                id: 'rootPath',
                label: 'Root Path (Opcional)',
                type: 'text',
                placeholder: '/Maturity360',
                hint: 'Ruta raíz donde se almacenarán todos los documentos',
                required: false
            }
        ]
    },
    {
        id: 'ONEDRIVE',
        label: 'OneDrive',
        icon: 'MicrosoftOutlookLogo',
        description: 'Almacenamiento en la nube de Microsoft',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        instructions: {
            title: 'Configurar Microsoft Graph API',
            steps: [
                'Ve a Azure Portal (portal.azure.com)',
                'Registra una nueva aplicación en Azure Active Directory',
                'En "API permissions", añade Files.ReadWrite.All de Microsoft Graph',
                'Crea un Client Secret en "Certificates & secrets"',
                'Configura las URLs de redirección para OAuth',
                'Genera un Refresh Token usando el flujo OAuth'
            ],
            warning: 'Los Client Secrets expiran. Configura una fecha de expiración larga o usa certificados.',
            links: [
                {
                    label: 'Azure Portal',
                    url: 'https://portal.azure.com/'
                },
                {
                    label: 'Graph Explorer',
                    url: 'https://developer.microsoft.com/en-us/graph/graph-explorer'
                },
                {
                    label: 'Documentación OneDrive API',
                    url: 'https://docs.microsoft.com/en-us/onedrive/developer/'
                }
            ]
        },
        fields: [
            {
                id: 'clientId',
                label: 'Client ID (Application ID)',
                type: 'text',
                placeholder: '12345678-1234-1234-1234-123456789abc',
                required: true
            },
            {
                id: 'clientSecret',
                label: 'Client Secret',
                type: 'password',
                placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                required: true
            },
            {
                id: 'refreshToken',
                label: 'Refresh Token',
                type: 'password',
                placeholder: 'M.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                required: true
            },
            {
                id: 'driveId',
                label: 'Drive ID (Opcional)',
                type: 'text',
                placeholder: 'b!xxxxxxxx',
                hint: 'ID del drive específico. Si está vacío, se usa el drive principal.',
                required: false
            }
        ]
    },
    {
        id: 'SHAREPOINT',
        label: 'SharePoint',
        icon: 'MicrosoftOutlookLogo',
        description: 'Bibliotecas de documentos de SharePoint',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        instructions: {
            title: 'Configurar SharePoint API',
            steps: [
                'Ve a Azure Portal y registra una aplicación',
                'Añade permisos de SharePoint: Sites.ReadWrite.All',
                'Crea un Client Secret',
                'Obtén el Tenant ID de tu organización',
                'Copia la URL del sitio de SharePoint donde quieres almacenar documentos'
            ],
            warning: 'Asegúrate de tener permisos de administrador en el sitio de SharePoint.',
            links: [
                {
                    label: 'Azure Portal',
                    url: 'https://portal.azure.com/'
                },
                {
                    label: 'SharePoint Admin Center',
                    url: 'https://admin.microsoft.com/sharepoint'
                },
                {
                    label: 'Documentación SharePoint API',
                    url: 'https://docs.microsoft.com/en-us/sharepoint/dev/'
                }
            ]
        },
        fields: [
            {
                id: 'siteUrl',
                label: 'Site URL',
                type: 'text',
                placeholder: 'https://yourcompany.sharepoint.com/sites/yoursite',
                required: true
            },
            {
                id: 'clientId',
                label: 'Client ID',
                type: 'text',
                placeholder: '12345678-1234-1234-1234-123456789abc',
                required: true
            },
            {
                id: 'clientSecret',
                label: 'Client Secret',
                type: 'password',
                placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                required: true
            },
            {
                id: 'tenantId',
                label: 'Tenant ID',
                type: 'text',
                placeholder: '12345678-1234-1234-1234-123456789abc',
                required: true
            },
            {
                id: 'libraryName',
                label: 'Library Name (Opcional)',
                type: 'text',
                placeholder: 'Documents',
                hint: 'Nombre de la biblioteca de documentos. Por defecto: Documents',
                required: false
            }
        ]
    },
    {
        id: 'S3',
        label: 'Amazon S3',
        icon: 'AmazonLogo',
        description: 'Almacenamiento de objetos de AWS',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        instructions: {
            title: 'Configurar Amazon S3',
            steps: [
                'Inicia sesión en AWS Console',
                'Crea un bucket en S3 o usa uno existente',
                'En IAM, crea un usuario con acceso programático',
                'Asigna una política con permisos S3 (s3:PutObject, s3:GetObject, s3:DeleteObject)',
                'Guarda las Access Keys generadas',
                'Configura CORS en el bucket si necesitas acceso desde el navegador'
            ],
            warning: 'Nunca expongas tus Access Keys. Usa roles IAM en producción cuando sea posible.',
            links: [
                {
                    label: 'AWS Console',
                    url: 'https://console.aws.amazon.com/s3/'
                },
                {
                    label: 'IAM Console',
                    url: 'https://console.aws.amazon.com/iam/'
                },
                {
                    label: 'Documentación S3',
                    url: 'https://docs.aws.amazon.com/s3/'
                }
            ]
        },
        fields: [
            {
                id: 'accessKeyId',
                label: 'Access Key ID',
                type: 'text',
                placeholder: 'AKIAIOSFODNN7EXAMPLE',
                required: true
            },
            {
                id: 'secretAccessKey',
                label: 'Secret Access Key',
                type: 'password',
                placeholder: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
                required: true
            },
            {
                id: 'bucket',
                label: 'Bucket Name',
                type: 'text',
                placeholder: 'my-maturity360-bucket',
                required: true
            },
            {
                id: 'region',
                label: 'Region',
                type: 'select',
                required: true,
                options: [
                    {
                        value: 'us-east-1',
                        label: 'US East (N. Virginia)'
                    },
                    {
                        value: 'us-east-2',
                        label: 'US East (Ohio)'
                    },
                    {
                        value: 'us-west-1',
                        label: 'US West (N. California)'
                    },
                    {
                        value: 'us-west-2',
                        label: 'US West (Oregon)'
                    },
                    {
                        value: 'eu-west-1',
                        label: 'EU (Ireland)'
                    },
                    {
                        value: 'eu-west-2',
                        label: 'EU (London)'
                    },
                    {
                        value: 'eu-west-3',
                        label: 'EU (Paris)'
                    },
                    {
                        value: 'eu-central-1',
                        label: 'EU (Frankfurt)'
                    },
                    {
                        value: 'ap-northeast-1',
                        label: 'Asia Pacific (Tokyo)'
                    },
                    {
                        value: 'ap-southeast-1',
                        label: 'Asia Pacific (Singapore)'
                    },
                    {
                        value: 'ap-southeast-2',
                        label: 'Asia Pacific (Sydney)'
                    },
                    {
                        value: 'sa-east-1',
                        label: 'South America (São Paulo)'
                    }
                ]
            },
            {
                id: 'prefix',
                label: 'Prefix (Opcional)',
                type: 'text',
                placeholder: 'maturity360/',
                hint: 'Prefijo para organizar archivos dentro del bucket',
                required: false
            }
        ],
        regions: [
            {
                id: 'us-east-1',
                label: 'US East (N. Virginia)',
                endpoint: 's3.us-east-1.amazonaws.com'
            },
            {
                id: 'eu-west-1',
                label: 'EU (Ireland)',
                endpoint: 's3.eu-west-1.amazonaws.com'
            },
            {
                id: 'sa-east-1',
                label: 'South America (São Paulo)',
                endpoint: 's3.sa-east-1.amazonaws.com'
            }
        ]
    },
    {
        id: 'LOCAL',
        label: 'Almacenamiento Local',
        icon: 'HardDrives',
        description: 'Almacenamiento en el servidor local',
        color: 'text-slate-600',
        bgColor: 'bg-slate-100',
        instructions: {
            title: 'Configurar Almacenamiento Local',
            steps: [
                'Define la ruta base donde se guardarán los archivos',
                'Asegúrate de que el directorio exista y tenga permisos de escritura',
                'Configura un límite de almacenamiento si es necesario',
                'Considera configurar backups periódicos del directorio'
            ],
            warning: 'El almacenamiento local no es recomendado para producción. Considera usar un proveedor en la nube.',
            links: []
        },
        fields: [
            {
                id: 'basePath',
                label: 'Ruta Base',
                type: 'text',
                placeholder: '/var/www/maturity360/storage',
                hint: 'Ruta absoluta en el servidor donde se almacenarán los archivos',
                required: true
            },
            {
                id: 'maxSizeGB',
                label: 'Límite de Almacenamiento (GB)',
                type: 'number',
                placeholder: '100',
                hint: 'Límite máximo de espacio en disco',
                required: false
            }
        ]
    }
];
function getStorageProviderPreset(providerId) {
    return storageProviderPresets.find((p)=>p.id === providerId);
}
}),
"[project]/components/storage/StorageSetupWizard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StorageSetupWizard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$X$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/X.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CloudArrowUp$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/CloudArrowUp.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CaretRight$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/CaretRight.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CaretLeft$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/CaretLeft.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CheckCircle$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/CheckCircle.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Warning$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Warning.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$ArrowSquareOut$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/ArrowSquareOut.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$SpinnerGap$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/SpinnerGap.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Gear$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Gear.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Shield$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Shield.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Check$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Check.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Eye$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Eye.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$EyeSlash$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/EyeSlash.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$GoogleDriveLogo$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/GoogleDriveLogo.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$DropboxLogo$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/DropboxLogo.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$MicrosoftOutlookLogo$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/MicrosoftOutlookLogo.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$AmazonLogo$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/AmazonLogo.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$HardDrives$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/HardDrives.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$FloppyDisk$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/FloppyDisk.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$storageProviderPresets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config/storageProviderPresets.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const STEPS = [
    {
        id: 'provider',
        label: 'Proveedor',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CloudArrowUp$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CloudArrowUp"], {
            weight: "bold"
        }, void 0, false, {
            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
            lineNumber: 44,
            columnNumber: 47
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'instructions',
        label: 'Instrucciones',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Shield$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Shield"], {
            weight: "bold"
        }, void 0, false, {
            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
            lineNumber: 45,
            columnNumber: 55
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'credentials',
        label: 'Credenciales',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Gear$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Gear"], {
            weight: "bold"
        }, void 0, false, {
            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
            lineNumber: 46,
            columnNumber: 53
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'verify',
        label: 'Verificar',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CheckCircle$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckCircle"], {
            weight: "bold"
        }, void 0, false, {
            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
            lineNumber: 47,
            columnNumber: 45
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'review',
        label: 'Guardar',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$FloppyDisk$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FloppyDisk"], {
            weight: "bold"
        }, void 0, false, {
            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
            lineNumber: 48,
            columnNumber: 43
        }, ("TURBOPACK compile-time value", void 0))
    }
];
const getProviderIcon = (iconName)=>{
    const icons = {
        'GoogleDriveLogo': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$GoogleDriveLogo$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GoogleDriveLogo"],
        'DropboxLogo': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$DropboxLogo$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropboxLogo"],
        'MicrosoftOutlookLogo': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$MicrosoftOutlookLogo$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MicrosoftOutlookLogo"],
        'AmazonLogo': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$AmazonLogo$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AmazonLogo"],
        'HardDrives': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$HardDrives$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HardDrives"]
    };
    return icons[iconName] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CloudArrowUp$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CloudArrowUp"];
};
function StorageSetupWizard({ isOpen, onClose, onComplete, existingConfig, tenantId }) {
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('provider');
    const [selectedProvider, setSelectedProvider] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [config, setConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [showSecrets, setShowSecrets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isVerifying, setIsVerifying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [verificationResult, setVerificationResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (existingConfig) {
            setSelectedProvider(existingConfig.provider);
            setConfig(existingConfig.config || {});
        }
    }, [
        existingConfig
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen) {
            setCurrentStep('provider');
            setVerificationResult(null);
        }
    }, [
        isOpen
    ]);
    const handleProviderSelect = (providerId)=>{
        setSelectedProvider(providerId);
        setConfig({});
        setVerificationResult(null);
    };
    const currentStepIndex = STEPS.findIndex((s)=>s.id === currentStep);
    const preset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$storageProviderPresets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStorageProviderPreset"])(selectedProvider);
    const canProceed = ()=>{
        switch(currentStep){
            case 'provider':
                return selectedProvider !== '';
            case 'instructions':
                return true;
            case 'credentials':
                if (!preset) return false;
                return preset.fields.filter((f)=>f.required).every((f)=>config[f.id]);
            case 'verify':
                return verificationResult?.success === true;
            case 'review':
                return true;
            default:
                return false;
        }
    };
    const goNext = ()=>{
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < STEPS.length) {
            setCurrentStep(STEPS[nextIndex].id);
        }
    };
    const goPrevious = ()=>{
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(STEPS[prevIndex].id);
            setVerificationResult(null);
        }
    };
    const handleVerify = async ()=>{
        setIsVerifying(true);
        setVerificationResult(null);
        try {
            const response = await fetch('/api/admin/storage-config/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tenantId,
                    provider: selectedProvider,
                    config
                })
            });
            const data = await response.json();
            setVerificationResult({
                success: data.success,
                message: data.success ? 'Conexión verificada correctamente' : data.error || 'Error de conexión'
            });
        } catch (error) {
            setVerificationResult({
                success: false,
                message: 'Error al verificar la conexión'
            });
        } finally{
            setIsVerifying(false);
        }
    };
    const handleSave = async ()=>{
        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/storage-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tenantId,
                    provider: selectedProvider,
                    config,
                    enabled: true
                })
            });
            if (response.ok) {
                onComplete({
                    provider: selectedProvider,
                    config,
                    enabled: true
                });
                onClose();
            }
        } catch (error) {
            console.error('Error saving config:', error);
        } finally{
            setIsSaving(false);
        }
    };
    const renderFieldInput = (field)=>{
        const commonClasses = "w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none";
        if (field.type === 'select' && field.options) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                value: config[field.id] || '',
                onChange: (e)=>setConfig((prev)=>({
                            ...prev,
                            [field.id]: e.target.value
                        })),
                className: commonClasses,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "",
                        children: "Seleccionar..."
                    }, void 0, false, {
                        fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this),
                    field.options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: opt.value,
                            children: opt.label
                        }, opt.value, false, {
                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                            lineNumber: 204,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                lineNumber: 197,
                columnNumber: 9
            }, this);
        }
        if (field.type === 'password') {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: showSecrets ? 'text' : 'password',
                        value: config[field.id] || '',
                        onChange: (e)=>setConfig((prev)=>({
                                    ...prev,
                                    [field.id]: e.target.value
                                })),
                        placeholder: field.placeholder,
                        className: `${commonClasses} pr-12`
                    }, void 0, false, {
                        fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                        lineNumber: 213,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setShowSecrets(!showSecrets),
                        className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white",
                        children: showSecrets ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$EyeSlash$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EyeSlash"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                            lineNumber: 225,
                            columnNumber: 28
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Eye$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Eye"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                            lineNumber: 225,
                            columnNumber: 53
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                        lineNumber: 220,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                lineNumber: 212,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: field.type,
            value: config[field.id] || '',
            onChange: (e)=>setConfig((prev)=>({
                        ...prev,
                        [field.id]: field.type === 'number' ? parseInt(e.target.value) || '' : e.target.value
                    })),
            placeholder: field.placeholder,
            className: commonClasses
        }, void 0, false, {
            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
            lineNumber: 232,
            columnNumber: 7
        }, this);
    };
    if (!isOpen) return null;
    const ProviderIcon = preset ? getProviderIcon(preset.icon) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CloudArrowUp$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CloudArrowUp"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-700",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between p-6 border-b border-slate-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CloudArrowUp$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CloudArrowUp"], {
                                        className: "w-5 h-5 text-blue-400",
                                        weight: "bold"
                                    }, void 0, false, {
                                        fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                        lineNumber: 252,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 251,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-xl font-semibold text-white",
                                            children: "Configurar Almacenamiento"
                                        }, void 0, false, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 255,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-slate-400",
                                            children: "Asistente de configuración"
                                        }, void 0, false, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 256,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 254,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                            lineNumber: 250,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "p-2 hover:bg-slate-800 rounded-lg transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$X$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["X"], {
                                className: "w-5 h-5 text-slate-400"
                            }, void 0, false, {
                                fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                lineNumber: 260,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                            lineNumber: 259,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                    lineNumber: 249,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700 overflow-x-auto",
                    children: STEPS.map((step, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center flex-shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${currentStep === step.id ? 'bg-blue-500/20 text-blue-400' : index < currentStepIndex ? 'text-green-400' : 'text-slate-500'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index < currentStepIndex ? 'bg-green-500/20' : currentStep === step.id ? 'bg-blue-500/30' : 'bg-slate-700'}`,
                                            children: index < currentStepIndex ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Check$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Check"], {
                                                weight: "bold",
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                lineNumber: 281,
                                                columnNumber: 47
                                            }, this) : index + 1
                                        }, void 0, false, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 274,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "hidden sm:inline text-sm font-medium",
                                            children: step.label
                                        }, void 0, false, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 283,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 267,
                                    columnNumber: 15
                                }, this),
                                index < STEPS.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CaretRight$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CaretRight"], {
                                    className: "w-4 h-4 text-slate-600 mx-2"
                                }, void 0, false, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 286,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, step.id, true, {
                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                            lineNumber: 266,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                    lineNumber: 264,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto p-6",
                    children: [
                        currentStep === 'provider' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-slate-300 mb-6",
                                    children: "Selecciona el proveedor de almacenamiento para guardar los documentos del sistema:"
                                }, void 0, false, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 295,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-3",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$storageProviderPresets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storageProviderPresets"].map((provider)=>{
                                        const Icon = getProviderIcon(provider.icon);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleProviderSelect(provider.id),
                                            className: `flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${selectedProvider === provider.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `w-12 h-12 rounded-xl flex items-center justify-center ${selectedProvider === provider.id ? 'bg-blue-500/20' : 'bg-slate-700'}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                        className: `w-6 h-6 ${selectedProvider === provider.id ? 'text-blue-400' : 'text-slate-400'}`,
                                                        weight: "fill"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                        lineNumber: 314,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                    lineNumber: 311,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "font-medium text-white",
                                                            children: provider.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                            lineNumber: 319,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-slate-400",
                                                            children: provider.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                            lineNumber: 320,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                    lineNumber: 318,
                                                    columnNumber: 23
                                                }, this),
                                                selectedProvider === provider.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CheckCircle$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckCircle"], {
                                                    className: "w-6 h-6 text-blue-400",
                                                    weight: "fill"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                    lineNumber: 323,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, provider.id, true, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 302,
                                            columnNumber: 21
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 298,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                            lineNumber: 294,
                            columnNumber: 13
                        }, this),
                        currentStep === 'instructions' && preset && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-blue-500/10 border border-blue-500/30 rounded-xl p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-blue-400 mb-4",
                                            children: preset.instructions.title
                                        }, void 0, false, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 335,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                            className: "space-y-3",
                                            children: preset.instructions.steps.map((step, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex gap-3 text-slate-300",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-sm font-bold text-blue-400",
                                                            children: index + 1
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                            lineNumber: 339,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: step
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                            lineNumber: 342,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, index, true, {
                                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                    lineNumber: 338,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 336,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 334,
                                    columnNumber: 15
                                }, this),
                                preset.instructions.warning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Warning$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Warning"], {
                                            className: "w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5",
                                            weight: "fill"
                                        }, void 0, false, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 350,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-amber-200 text-sm",
                                            children: preset.instructions.warning
                                        }, void 0, false, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 351,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 349,
                                    columnNumber: 17
                                }, this),
                                preset.instructions.links.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "text-sm font-medium text-slate-400",
                                            children: "Enlaces útiles:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 357,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2",
                                            children: preset.instructions.links.map((link, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: link.url,
                                                    target: "_blank",
                                                    rel: "noopener noreferrer",
                                                    className: "flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-blue-400 transition-colors",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$ArrowSquareOut$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ArrowSquareOut"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                            lineNumber: 367,
                                                            columnNumber: 25
                                                        }, this),
                                                        link.label
                                                    ]
                                                }, index, true, {
                                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                    lineNumber: 360,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 358,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 356,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                            lineNumber: 333,
                            columnNumber: 13
                        }, this),
                        currentStep === 'credentials' && preset && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-slate-300 mb-4",
                                    children: [
                                        "Ingresa las credenciales para ",
                                        preset.label,
                                        ":"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 379,
                                    columnNumber: 15
                                }, this),
                                preset.fields.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-slate-300 mb-2",
                                                children: [
                                                    field.label,
                                                    !field.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-slate-500 ml-2",
                                                        children: "(Opcional)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                        lineNumber: 387,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                lineNumber: 385,
                                                columnNumber: 19
                                            }, this),
                                            renderFieldInput(field),
                                            field.hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-500 mt-1",
                                                children: field.hint
                                            }, void 0, false, {
                                                fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                lineNumber: 391,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, field.id, true, {
                                        fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                        lineNumber: 384,
                                        columnNumber: 17
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                            lineNumber: 378,
                            columnNumber: 13
                        }, this),
                        currentStep === 'verify' && preset && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-slate-300",
                                    children: "Verifica que la configuración es correcta probando la conexión:"
                                }, void 0, false, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 400,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-slate-800 rounded-xl p-4 space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Proveedor:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                    lineNumber: 406,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-white font-medium",
                                                    children: preset.label
                                                }, void 0, false, {
                                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                    lineNumber: 407,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 405,
                                            columnNumber: 17
                                        }, this),
                                        preset.fields.filter((f)=>f.type !== 'password' && config[f.id]).map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-slate-400",
                                                        children: [
                                                            field.label,
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                        lineNumber: 411,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white font-mono text-xs truncate max-w-[200px]",
                                                        children: config[field.id]
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                        lineNumber: 412,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, field.id, true, {
                                                fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                lineNumber: 410,
                                                columnNumber: 19
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 404,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleVerify,
                                    disabled: isVerifying,
                                    className: "w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-xl transition-colors",
                                    children: isVerifying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$SpinnerGap$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SpinnerGap"], {
                                                className: "w-5 h-5 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                lineNumber: 424,
                                                columnNumber: 21
                                            }, this),
                                            "Verificando conexión..."
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CloudArrowUp$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CloudArrowUp"], {
                                                className: "w-5 h-5",
                                                weight: "bold"
                                            }, void 0, false, {
                                                fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                lineNumber: 429,
                                                columnNumber: 21
                                            }, this),
                                            "Probar Conexión"
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 417,
                                    columnNumber: 15
                                }, this),
                                verificationResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `rounded-xl p-4 flex items-start gap-3 ${verificationResult.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`,
                                    children: [
                                        verificationResult.success ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CheckCircle$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckCircle"], {
                                            className: "w-5 h-5 text-green-400 flex-shrink-0",
                                            weight: "fill"
                                        }, void 0, false, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 442,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Warning$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Warning"], {
                                            className: "w-5 h-5 text-red-400 flex-shrink-0",
                                            weight: "fill"
                                        }, void 0, false, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 444,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: verificationResult.success ? 'text-green-300' : 'text-red-300',
                                                    children: verificationResult.message
                                                }, void 0, false, {
                                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                    lineNumber: 447,
                                                    columnNumber: 21
                                                }, this),
                                                !verificationResult.success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-slate-400 mt-2",
                                                    children: "Verifica que las credenciales sean correctas y que el servicio esté accesible."
                                                }, void 0, false, {
                                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                    lineNumber: 451,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 446,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 436,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                            lineNumber: 399,
                            columnNumber: 13
                        }, this),
                        currentStep === 'review' && preset && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CheckCircle$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckCircle"], {
                                            className: "w-6 h-6 text-green-400 flex-shrink-0",
                                            weight: "fill"
                                        }, void 0, false, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 464,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-medium text-green-400",
                                                    children: "Configuración verificada"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                    lineNumber: 466,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-green-300/80 mt-1",
                                                    children: "La conexión funciona correctamente. Puedes guardar la configuración."
                                                }, void 0, false, {
                                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                    lineNumber: 467,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 465,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 463,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-slate-800 rounded-xl divide-y divide-slate-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 flex justify-between items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Proveedor"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                    lineNumber: 475,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ProviderIcon, {
                                                            className: "w-5 h-5 text-blue-400",
                                                            weight: "fill"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                            lineNumber: 477,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-white font-medium",
                                                            children: preset.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                            lineNumber: 478,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                    lineNumber: 476,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 474,
                                            columnNumber: 17
                                        }, this),
                                        preset.fields.filter((f)=>f.type !== 'password' && config[f.id]).map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-4 flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-slate-400",
                                                        children: field.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                        lineNumber: 483,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white font-mono text-sm truncate max-w-[200px]",
                                                        children: config[field.id]
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                        lineNumber: 484,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, field.id, true, {
                                                fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                lineNumber: 482,
                                                columnNumber: 19
                                            }, this)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 flex justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400",
                                                    children: "Estado"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                    lineNumber: 488,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-green-400 font-medium",
                                                    children: "Habilitado"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                                    lineNumber: 489,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                            lineNumber: 487,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 473,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                            lineNumber: 462,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                    lineNumber: 292,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between p-6 border-t border-slate-700 bg-slate-800/50",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: goPrevious,
                            disabled: currentStepIndex === 0,
                            className: "flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CaretLeft$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CaretLeft"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 502,
                                    columnNumber: 13
                                }, this),
                                "Anterior"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                            lineNumber: 497,
                            columnNumber: 11
                        }, this),
                        currentStep === 'review' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSave,
                            disabled: isSaving,
                            className: "flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-medium rounded-xl transition-colors",
                            children: isSaving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$SpinnerGap$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SpinnerGap"], {
                                        className: "w-5 h-5 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                        lineNumber: 514,
                                        columnNumber: 19
                                    }, this),
                                    "Guardando..."
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$FloppyDisk$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FloppyDisk"], {
                                        className: "w-5 h-5",
                                        weight: "bold"
                                    }, void 0, false, {
                                        fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                        lineNumber: 519,
                                        columnNumber: 19
                                    }, this),
                                    "Guardar Configuración"
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                            lineNumber: 507,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: goNext,
                            disabled: !canProceed(),
                            className: "flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors",
                            children: [
                                "Siguiente",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CaretRight$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CaretRight"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                                    lineNumber: 531,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                            lineNumber: 525,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/storage/StorageSetupWizard.tsx",
                    lineNumber: 496,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/storage/StorageSetupWizard.tsx",
            lineNumber: 248,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/storage/StorageSetupWizard.tsx",
        lineNumber: 247,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/dashboard/admin/storage/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TenantStorageConfigPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/AppContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CloudArrowUp$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/CloudArrowUp.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CheckCircle$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/CheckCircle.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$XCircle$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/XCircle.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Warning$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Warning.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$GoogleDriveLogo$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/GoogleDriveLogo.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$DropboxLogo$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/DropboxLogo.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$MicrosoftOutlookLogo$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/MicrosoftOutlookLogo.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$AmazonLogo$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/AmazonLogo.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$HardDrives$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/HardDrives.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$FloppyDisk$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/FloppyDisk.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Eye$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/Eye.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$EyeSlash$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/EyeSlash.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$MagicWand$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@phosphor-icons/react/dist/csr/MagicWand.es.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AdminGuide$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AdminGuide.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$adminGuides$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/adminGuides.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$storage$2f$StorageSetupWizard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/storage/StorageSetupWizard.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
function TenantStorageConfigPage() {
    const { currentTenantId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    const tenant = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DB"].tenants.find((t)=>t.id === currentTenantId);
    const [showWizard, setShowWizard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedProvider, setSelectedProvider] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(tenant?.storageConfig?.provider || 'LOCAL');
    const [config, setConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(tenant?.storageConfig?.config || {});
    const [showSecrets, setShowSecrets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [testing, setTesting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [testResult, setTestResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [saved, setSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const providers = [
        {
            id: 'GOOGLE_DRIVE',
            name: 'Google Drive',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$GoogleDriveLogo$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GoogleDriveLogo"],
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            id: 'DROPBOX',
            name: 'Dropbox',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$DropboxLogo$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropboxLogo"],
            color: 'text-blue-700',
            bgColor: 'bg-blue-50'
        },
        {
            id: 'ONEDRIVE',
            name: 'OneDrive',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$MicrosoftOutlookLogo$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MicrosoftOutlookLogo"],
            color: 'text-blue-500',
            bgColor: 'bg-blue-50'
        },
        {
            id: 'SHAREPOINT',
            name: 'SharePoint',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$MicrosoftOutlookLogo$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MicrosoftOutlookLogo"],
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            id: 'S3',
            name: 'Amazon S3',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$AmazonLogo$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AmazonLogo"],
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
        {
            id: 'LOCAL',
            name: 'Almacenamiento Local',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$HardDrives$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HardDrives"],
            color: 'text-slate-600',
            bgColor: 'bg-slate-50'
        }
    ];
    const handleTestConnection = async ()=>{
        setTesting(true);
        setTestResult(null);
        // Simulate API call to test connection
        await new Promise((resolve)=>setTimeout(resolve, 2000));
        // Mock validation
        const isValid = validateConfig();
        if (isValid) {
            setTestResult({
                status: 'success',
                message: 'Conexión exitosa. El proveedor está configurado correctamente.'
            });
        } else {
            setTestResult({
                status: 'failed',
                message: 'Error de conexión. Verifica las credenciales.'
            });
        }
        setTesting(false);
    };
    const validateConfig = ()=>{
        switch(selectedProvider){
            case 'GOOGLE_DRIVE':
                return !!(config.clientId && config.clientSecret && config.refreshToken);
            case 'DROPBOX':
                return !!config.accessToken;
            case 'ONEDRIVE':
                return !!(config.clientId && config.clientSecret && config.refreshToken);
            case 'SHAREPOINT':
                return !!(config.siteUrl && config.clientId && config.clientSecret && config.tenantId);
            case 'S3':
                return !!(config.accessKeyId && config.secretAccessKey && config.region && config.bucket);
            case 'LOCAL':
                return !!config.basePath;
            default:
                return false;
        }
    };
    const handleSave = ()=>{
        if (!tenant) return;
        const storageConfig = {
            provider: selectedProvider,
            enabled: true,
            config: config,
            lastTested: testResult?.status === 'success' ? new Date().toISOString() : undefined,
            testStatus: testResult?.status,
            testMessage: testResult?.message
        };
        tenant.storageConfig = storageConfig;
        setSaved(true);
        setTimeout(()=>setSaved(false), 3000);
    };
    const handleWizardComplete = (wizardConfig)=>{
        setSelectedProvider(wizardConfig.provider);
        setConfig(wizardConfig.config);
        setTestResult({
            status: 'success',
            message: 'Configuración guardada desde el asistente'
        });
        setSaved(true);
        setTimeout(()=>setSaved(false), 3000);
    };
    const renderConfigForm = ()=>{
        switch(selectedProvider){
            case 'GOOGLE_DRIVE':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Client ID"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 117,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: config.clientId || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            clientId: e.target.value
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "123456789-abcdefg.apps.googleusercontent.com"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 118,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 116,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Client Secret"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 127,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: showSecrets ? 'text' : 'password',
                                            value: config.clientSecret || '',
                                            onChange: (e)=>setConfig({
                                                    ...config,
                                                    clientSecret: e.target.value
                                                }),
                                            className: "w-full p-3 pr-12 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                            placeholder: "GOCSPX-xxxxxxxxxxxxxxxxxxxxx"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                            lineNumber: 129,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowSecrets(!showSecrets),
                                            className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600",
                                            children: showSecrets ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$EyeSlash$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EyeSlash"], {
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                                lineNumber: 140,
                                                columnNumber: 52
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Eye$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Eye"], {
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                                lineNumber: 140,
                                                columnNumber: 77
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                            lineNumber: 136,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 128,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 126,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Refresh Token"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 145,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: showSecrets ? 'text' : 'password',
                                    value: config.refreshToken || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            refreshToken: e.target.value
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "1//xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 146,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 144,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Folder ID (Opcional)"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 155,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: config.folderId || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            folderId: e.target.value
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "1AbCdEfGhIjKlMnOpQrStUvWxYz"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 156,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-slate-500 mt-1",
                                    children: "ID de la carpeta raíz donde se almacenarán todos los documentos"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 163,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 154,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                    lineNumber: 115,
                    columnNumber: 21
                }, this);
            case 'DROPBOX':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Access Token"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 172,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: showSecrets ? 'text' : 'password',
                                    value: config.accessToken || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            accessToken: e.target.value
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "sl.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 173,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 171,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Root Path (Opcional)"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 182,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: config.rootPath || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            rootPath: e.target.value
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "/Maturity360"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 183,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-slate-500 mt-1",
                                    children: "Ruta raíz donde se almacenarán todos los documentos"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 190,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 181,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                    lineNumber: 170,
                    columnNumber: 21
                }, this);
            case 'ONEDRIVE':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Client ID (Application ID)"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 199,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: config.clientId || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            clientId: e.target.value
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "12345678-1234-1234-1234-123456789abc"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 200,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 198,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Client Secret"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 209,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: showSecrets ? 'text' : 'password',
                                    value: config.clientSecret || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            clientSecret: e.target.value
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 210,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 208,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Refresh Token"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 219,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: showSecrets ? 'text' : 'password',
                                    value: config.refreshToken || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            refreshToken: e.target.value
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "M.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 220,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 218,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                    lineNumber: 197,
                    columnNumber: 21
                }, this);
            case 'SHAREPOINT':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Site URL"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 235,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: config.siteUrl || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            siteUrl: e.target.value
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "https://yourcompany.sharepoint.com/sites/yoursite"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 236,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 234,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Client ID"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 245,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: config.clientId || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            clientId: e.target.value
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "12345678-1234-1234-1234-123456789abc"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 246,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 244,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Client Secret"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 255,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: showSecrets ? 'text' : 'password',
                                    value: config.clientSecret || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            clientSecret: e.target.value
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 256,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 254,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Tenant ID"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 265,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: config.tenantId || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            tenantId: e.target.value
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "12345678-1234-1234-1234-123456789abc"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 266,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 264,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                    lineNumber: 233,
                    columnNumber: 21
                }, this);
            case 'S3':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Access Key ID"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 281,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: config.accessKeyId || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            accessKeyId: e.target.value
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "AKIAIOSFODNN7EXAMPLE"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 282,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 280,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Secret Access Key"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 291,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: showSecrets ? 'text' : 'password',
                                    value: config.secretAccessKey || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            secretAccessKey: e.target.value
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 292,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 290,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Region"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 301,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: config.region || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            region: e.target.value
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "us-east-1"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 302,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 300,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Bucket Name"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 311,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: config.bucket || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            bucket: e.target.value
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "my-maturity360-bucket"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 312,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 310,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                    lineNumber: 279,
                    columnNumber: 21
                }, this);
            case 'LOCAL':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Ruta Base"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 327,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: config.basePath || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            basePath: e.target.value
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "/var/www/maturity360/storage"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 328,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-slate-500 mt-1",
                                    children: "Ruta absoluta en el servidor donde se almacenarán los archivos"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 335,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 326,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-bold text-slate-700 mb-2",
                                    children: "Límite de Almacenamiento (GB)"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 338,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    value: config.maxSizeGB || '',
                                    onChange: (e)=>setConfig({
                                            ...config,
                                            maxSizeGB: parseInt(e.target.value) || undefined
                                        }),
                                    className: "w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                    placeholder: "100"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 339,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 337,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                    lineNumber: 325,
                    columnNumber: 21
                }, this);
            default:
                return null;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-8 max-w-6xl mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CloudArrowUp$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CloudArrowUp"], {
                                        size: 36,
                                        className: "text-blue-600"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                        lineNumber: 360,
                                        columnNumber: 25
                                    }, this),
                                    "Configuración de Almacenamiento"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                lineNumber: 359,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-slate-600",
                                children: "Configura el proveedor de almacenamiento en la nube donde se guardarán todos los documentos del sistema."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                lineNumber: 363,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                        lineNumber: 358,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowWizard(true),
                        className: "flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$MagicWand$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MagicWand"], {
                                size: 20,
                                weight: "bold"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                lineNumber: 371,
                                columnNumber: 21
                            }, this),
                            "Asistente de Configuración"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                        lineNumber: 367,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                lineNumber: 357,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl border border-slate-200 p-6 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold text-slate-800 mb-4",
                        children: "Seleccionar Proveedor"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                        lineNumber: 378,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 md:grid-cols-3 gap-4",
                        children: providers.map((provider)=>{
                            const Icon = provider.icon;
                            const isSelected = selectedProvider === provider.id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setSelectedProvider(provider.id);
                                    setConfig({});
                                    setTestResult(null);
                                },
                                className: `p-4 rounded-lg border-2 transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `p-3 rounded-lg ${provider.bgColor}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                size: 32,
                                                className: provider.color,
                                                weight: "fill"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                                lineNumber: 398,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                            lineNumber: 397,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-bold text-slate-700",
                                            children: provider.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                            lineNumber: 400,
                                            columnNumber: 37
                                        }, this),
                                        isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CheckCircle$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckCircle"], {
                                            size: 20,
                                            className: "text-blue-600",
                                            weight: "fill"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                            lineNumber: 402,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 396,
                                    columnNumber: 33
                                }, this)
                            }, provider.id, false, {
                                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                lineNumber: 384,
                                columnNumber: 29
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                        lineNumber: 379,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                lineNumber: 377,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl border border-slate-200 p-6 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold text-slate-800 mb-4",
                        children: [
                            "Configuración de ",
                            providers.find((p)=>p.id === selectedProvider)?.name
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                        lineNumber: 413,
                        columnNumber: 17
                    }, this),
                    renderConfigForm()
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                lineNumber: 412,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl border border-slate-200 p-6 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold text-slate-800 mb-4",
                        children: "Probar Conexión"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                        lineNumber: 419,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleTestConnection,
                        disabled: testing || !validateConfig(),
                        className: "px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2",
                        children: testing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 427,
                                    columnNumber: 29
                                }, this),
                                "Probando conexión..."
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CloudArrowUp$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CloudArrowUp"], {
                                    size: 20,
                                    weight: "bold"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                    lineNumber: 432,
                                    columnNumber: 29
                                }, this),
                                "Probar Conexión"
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                        lineNumber: 420,
                        columnNumber: 17
                    }, this),
                    testResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `mt-4 p-4 rounded-lg flex items-start gap-3 ${testResult.status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`,
                        children: [
                            testResult.status === 'success' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CheckCircle$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckCircle"], {
                                size: 24,
                                className: "text-green-600 flex-shrink-0",
                                weight: "fill"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                lineNumber: 444,
                                columnNumber: 29
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$XCircle$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["XCircle"], {
                                size: 24,
                                className: "text-red-600 flex-shrink-0",
                                weight: "fill"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                lineNumber: 446,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `font-bold ${testResult.status === 'success' ? 'text-green-800' : 'text-red-800'}`,
                                        children: testResult.status === 'success' ? 'Conexión Exitosa' : 'Error de Conexión'
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                        lineNumber: 449,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `text-sm ${testResult.status === 'success' ? 'text-green-700' : 'text-red-700'}`,
                                        children: testResult.message
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                        lineNumber: 452,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                lineNumber: 448,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                        lineNumber: 439,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                lineNumber: 418,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end gap-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleSave,
                    disabled: !validateConfig() || testResult?.status !== 'success',
                    className: "px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$FloppyDisk$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FloppyDisk"], {
                            size: 20,
                            weight: "bold"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                            lineNumber: 467,
                            columnNumber: 21
                        }, this),
                        "Guardar Configuración"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                    lineNumber: 462,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                lineNumber: 461,
                columnNumber: 13
            }, this),
            saved && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fadeIn",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$CheckCircle$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckCircle"], {
                        size: 24,
                        weight: "fill"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                        lineNumber: 474,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-bold",
                        children: "Configuración guardada exitosamente"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                        lineNumber: 475,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                lineNumber: 473,
                columnNumber: 17
            }, this),
            tenant?.storageConfig && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$phosphor$2d$icons$2f$react$2f$dist$2f$csr$2f$Warning$2e$es$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Warning"], {
                        size: 24,
                        className: "text-amber-600 flex-shrink-0",
                        weight: "fill"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                        lineNumber: 482,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-amber-800",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-bold mb-1",
                                children: "Importante:"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                lineNumber: 484,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Cambiar el proveedor de almacenamiento no migrará automáticamente los archivos existentes. Asegúrate de realizar una migración manual si es necesario."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                                lineNumber: 485,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                        lineNumber: 483,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                lineNumber: 481,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AdminGuide$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$adminGuides$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storageGuide"]
            }, void 0, false, {
                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                lineNumber: 491,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$storage$2f$StorageSetupWizard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                isOpen: showWizard,
                onClose: ()=>setShowWizard(false),
                onComplete: handleWizardComplete,
                existingConfig: tenant?.storageConfig ? {
                    provider: tenant.storageConfig.provider,
                    config: tenant.storageConfig.config || {},
                    enabled: tenant.storageConfig.enabled
                } : null,
                tenantId: currentTenantId || ''
            }, void 0, false, {
                fileName: "[project]/app/dashboard/admin/storage/page.tsx",
                lineNumber: 494,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/admin/storage/page.tsx",
        lineNumber: 356,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=_b13f129b._.js.map