'use strict';
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



};
