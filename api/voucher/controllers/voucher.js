'use strict';
var qs = require('qs');
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

    async updatevoucher(ctx) {

        const { voucherCode } = ctx.params; //have to find id through the voucherCode
        let entity;

        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            entity = await strapi.services.voucher.update({ voucherCode }, data, {
                files,
            });
        } else {
            entity = await strapi.services.voucher.update({ voucherCode }, ctx.request.body);
        }
        entity.status = 'SUBMITTED';
        return sanitizeEntity(entity, { model: strapi.models.voucher });
    },


    async findvoucher(ctx) {
        const { voucherCode } = ctx.params;

        const entity = await strapi.services.voucher.findOne({ voucherCode });
        return sanitizeEntity(entity, { model: strapi.models.voucher });
    },


    async updatestatus(ctx) {

        const { id } = ctx.params; //have to find id through the id
        let entity;
        const checkVoucher = await strapi.services.voucher.findOne({ id });
        //if (checkVoucher.status !== "SUBMITTED" && checkVoucher.status !== "DELIVERING") {
        if (checkVoucher.status === "PENDING") {
            ctx.throw(400, "Status cannot be changed while pending");
        }

        if (checkVoucher.status === "DELIVERED") {
            ctx.throw(400, "Status cannot be changed while delivered");
        }

        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            entity = await strapi.services.voucher.update({ id }, data, {
                files,
            });
        } else {

            entity = await strapi.services.voucher.update({ id }, ctx.request.body);
        }
        return sanitizeEntity(entity, { model: strapi.models.voucher });
    },


    async productvouchers(ctx) {

        let entities;
        let finalArray;
        const { productId }= ctx.params;

        ctx.state.query = qs.parse(ctx.state.querystring = `product.id=${productId}`);

        if (ctx.query._q) { //? not sure if I even need to put code here, repeating the code just in case
            entities = await strapi.services.voucher.search(ctx.state.query);
            finalArray = entities.map(item => {
                let newItem = ({
                    ...item
                });
                delete newItem.product;
                return newItem;
            });
            console.log("ctx.query._q is true");
        } else {
            entities = await strapi.services.voucher.find(ctx.state.query); //TODO Look at http://knexjs.org/#Builder
            finalArray = entities.map(item => {
                let newItem = ({
                    ...item
                });
                delete newItem.product;
                return newItem;
            });
        }

        return finalArray.map(entity => sanitizeEntity(entity, { model: strapi.models.voucher }));



    },



};
