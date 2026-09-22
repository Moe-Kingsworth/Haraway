import { r as createServerFn } from "./ssr.mjs";
import { n as authMiddleware } from "./format-Tz25-cit.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm-Dhws9iQH.js
var listClients = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("c1db5569404235c31597f22f3305a9d5227aef7a96072cb9cbc23397ff1af32e"));
var upsertClient = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("05ab7cbfc47bd5fbf8fe3beeafdffdeb8c9a5da55ec6c0ae60e150d8f643ce75"));
var listProperties = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f33bbc0e040b4db94f74c4a6ed712eedc1d5b4cd350b1cf7eacdf664f59a5aa5"));
var upsertProperty = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d6fabe816eb76beb35beaeb5ab9838e9a8da2b6e30092bc8c32f1514d20098b4"));
var listDeals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("0bde0df726b74971aa81916f53deb79a915b1b63f391aa282a18aac03a2bd85a"));
var upsertDeal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("0a0c878cfed22eb620cafc695fe65d67699f879d18bc5a69e0d05b9cc1d8fe40"));
var getDeal = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e2babbf7e7c833fff08a5df87db098ff2fc81e42c4fc82c41859bc2ca7444cab"));
var listPayments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d43827848ef3f91cac3c8d697ec73856ec25fcda2175ef55bfbf9e59293e145c"));
var createPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e7ff071f407541e41e51ee0361709f911fee9a19b9248a7798abf129ac7b4181"));
var getPayment = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("c27d4c67d9b551e7e3d17f895bf95e93275622be48906b0306d07881fa94e5a6"));
//#endregion
export { listDeals as a, upsertClient as c, listClients as i, upsertDeal as l, getDeal as n, listPayments as o, getPayment as r, listProperties as s, createPayment as t, upsertProperty as u };
