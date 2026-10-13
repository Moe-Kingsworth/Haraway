import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-Yj8VJyDF.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jobs-Bpxr4sVI.js
var getPublicJobPostings = createServerFn({ method: "GET" }).handler(createSsrRpc("c4b8b0e5b5b990f6fc6cda2ba57a3fa8ecb713c6e043a66708bb68e70e444ffb"));
var getPublicJobPostingById = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("f16cc6c9cd451a8e6328490c99401dbdf485641809de12c097a489753974dce2"));
var submitPublicJobApplication = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("819bdd40f71dfd9f5459f2717a35ab8271f2496be8508dbe95c77e361feef0cf"));
var listJobPostings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f68a4c4a5abb78ab3df508212b6f2ca31027da7ebf060d2621d39377bff00acb"));
var upsertJobPosting = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d4c6ec975cfeeec9fbc8896155661a5a5e3a8d1280150b2bcf6c9a1cbd1f8446"));
var deleteJobPosting = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ddc0e15c8fa3da28ed90c8f7e30dbb4bf6d0ccc9f46f81f1a9af714a464d1021"));
var listJobApplications = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("2f058fec73a45b26298be15d26fd140a02f91ace744e4e9a9a700a9539f84e7b"));
var updateApplicationStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("a69f0fe4e480becee71d673c966c34f27d213ca89bff661d89a2428f30dfebe0"));
var convertApplicationToStaff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("69fa6ce9ae19fc55a5745705209d45bac5d7117309a0a1e07e7064eeecfc920a"));
//#endregion
export { listJobApplications as a, updateApplicationStatus as c, getPublicJobPostings as i, upsertJobPosting as l, deleteJobPosting as n, listJobPostings as o, getPublicJobPostingById as r, submitPublicJobApplication as s, convertApplicationToStaff as t };
