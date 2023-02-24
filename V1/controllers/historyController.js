import { models } from '../../model/index';
import { logger } from '../../logger/logger';
import { sendCustomResponse } from '../../responses/responses';
import { responseMessageCode } from '../../responses/messageCodes';
import { getResponseMessage } from '../../language/multilanguageController';
import { Success, BadRequest, serverError, role as roles } from '../../constants/constants';
import { Op } from 'sequelize';

class feedback {
    async createFeedback(req, res) {
        const language = req.headers.lan;
        // const transaction = await sequalize.transaction();
        const { regioncode } = req.headers;
        try {
            const { user_role_id, user_seller_id, user_driver_id, admin_id, role } = req.decode;
            const { title, title_ar, comment, comment_ar } = req.body
            let feedbackAttachment = typeof req.body.attachment != 'undefined' ? req.body.attachment : [];
            let countryId = null;
            if (admin_id)
                return sendCustomResponse(res, getResponseMessage(responseMessageCode.INVALID_ACCESS, language || 'en'), BadRequest.INVALID);

            let AuthUser = (role === roles.user) ? user_role_id : (role === roles.seller) ? user_seller_id : user_driver_id;

            if (regioncode) {
                countryId = await models.currency.findOne(
                    {
                        where: { regionCode: regioncode },
                        attributes: ["id"],
                        raw: true,
                    }

                )
                if (countryId) {
                    countryId = countryId.id;

                }

            }
            const feedbackComment = await models.feedback.create({
                title, title_ar: title_ar || title,
                comment, comment_ar: comment_ar || comment, actionTaken: false, countryId, user_role_id: AuthUser, isActive: 1, isDeleted: 0
            },
                // { transaction: transaction }
            );
            if (feedbackAttachment.length > 0 && feedbackComment) {
                await feedbackComment.setAttachments(feedbackAttachment,
                    // { transaction: transaction }
                );
                let query = `UPDATE tb_attachment SET user_roles_id = ? , in_use = ? WHERE id in (?)`;

                await models.baseModel.update({

                    query: query,

                    values: [AuthUser, 1, feedbackAttachment]

                })

            }
            // await transaction.commit();
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.ACTION_COMPLETE, language || 'en'), Success.OK, feedbackComment);
        } catch (error) {

            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
            // await transaction.rollback();
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SHOW_ERROR_MESSAGE, language || 'en'), serverError.Internal_Server_error, { error: error.toString() });
        }
    }

    async deleteFeedback(req, res) {
        const language = req.headers.lan;
        const { regioncode } = req.headers;
        try {
            const { user_role_id, user_seller_id, user_driver_id, role } = req.decode;
            const { feedbackId } = req.body;
            if (!user_role_id || !user_seller_id || !user_driver_id)
                return sendCustomResponse(res, getResponseMessage(responseMessageCode.INVALID_ACCESS, language || 'en'), BadRequest.INVALID);
            await models.feedback.update(
                {
                    isDeleted: 1
                },
                {
                    where: { id: feedbackId }
                });
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.THE_FEEDBACK_IS_DELETED, language || 'en'), Success.OK);
        } catch (error) {
            console.log(error);
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SHOW_ERROR_MESSAGE, language || 'en'), serverError.Internal_Server_error, { error: error.toString() });
        }
    }

    async feedbackStatusChange(req, res) {
        const language = req.headers.lan;
        try {
            const { admin_id } = req.decode;
            let { isActive, feedbackId } = req.body;
            console.log("isActive, feedbackId", isActive, feedbackId)
            if (!admin_id)
                return sendCustomResponse(res, getResponseMessage(responseMessageCode.INVALID_ACCESS, language || 'en'), BadRequest.INVALID);
            if (isActive) {
                await models.feedback.update(
                    { isActive: 1 },
                    {
                        where: { id: feedbackId }
                    });
            }
            else {
                await models.feedback.update(
                    { isActive: 0 },
                    {
                        where: { id: feedbackId }
                    });
            }
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.THE_FEEDBACK_STATUS_CHANGED, language || 'en'), Success.OK);
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SHOW_ERROR_MESSAGE, language || 'en'), serverError.Internal_Server_error, { error: error.toString() });
        }
    }

    async feedbackActionChange(req, res) {
        const language = req.headers.lan;
        try {
            const { admin_id } = req.decode;
            let { actionTaken, feedbackId } = req.body;
            if (!admin_id)
                return sendCustomResponse(res, getResponseMessage(responseMessageCode.INVALID_ACCESS, language || 'en'), BadRequest.INVALID);
            if (actionTaken) {
                await models.feedback.update(
                    { actionTaken: 1 },
                    {
                        where: { id: feedbackId }
                    });
            }
            else {
                await models.feedback.update(
                    { actionTaken: 0 },
                    {
                        where: { id: feedbackId }
                    });
            }
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.FEEDBACK_ACTION_TAKEN, language || 'en'), Success.OK);
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SHOW_ERROR_MESSAGE, language || 'en'), serverError.Internal_Server_error, { error: error.toString() });
        }
    }

    async getFeedback(req, res) {
        const language = req.headers.lan;
        try {
            const { admin_id } = req.decode;
            let {countryId} = req.query;
            if (!admin_id)
                return sendCustomResponse(res, getResponseMessage(responseMessageCode.INVALID_ACCESS, language || 'en'), BadRequest.INVALID);

            let limit = parseInt(req.query.limit) || 10;
            let page = parseInt(req.query.page) || 1;
            let loadMoreFlag = false;
            let offset = limit * (page - 1);
            let where = {
                isActive: 1,
                isDeleted: 0
            };
          
            if(parseInt(countryId)){
                where = {
                    countryId,
                }
            }
            const feedbackList = await models.feedback.findAndCountAll({
                where,
                include: [
                    {
                        model: models.userRole,
                        attributes: ["fullName"]
                    },

                    {
                        model: models.attachment,
                        attributes: ["id", ["path", "image_url"], ["thumbnail", "thumb_url"], "type", "key_type"],
                    },
                    {
                        model: models.currency,
                        attributes: ["country"]
                    }
                ],
                offset: offset,
                order: [["createdAt", "DESC"]],
                limit: limit
            })
                if (feedbackList.count == 0)
                {
                  return sendCustomResponse(res, getResponseMessage(responseMessageCode.NO_DATA_FOUND, language || 'en'), Success.OK)

                }

            let pages = Math.ceil(feedbackList.count / limit);
            if ((pages - page) > 0) {
                loadMoreFlag = true;
            }
                let Rsult = {
                    totalCounts: feedbackList.count, totalPages: pages, loadMoreFlag: loadMoreFlag, feedback: feedbackList.rows
                }
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.ACTION_COMPLETE, language || 'en'), Success.OK, Rsult)
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SOMETHING_WENT_WRONG, language || 'en'), serverError.Internal_Server_error);
        }
    }

    async getFeedBackById(req, res) {
        const language = req.headers.lan;
        try {
            const { admin_id } = req.decode;
            const { feedbackId } = req.query;
            if (!admin_id) {
                return sendCustomResponse(res, getResponseMessage(responseMessageCode.INVALID_ACCESS, language || 'en'), BadRequest.INVALID);
            }
            const feedbackDetail = await models.feedback.findOne({
                where: {
                    [Op.and]: [
                        {
                            id: feedbackId

                        },

                        {
                            isDeleted: false
                        },

                        {
                            isActive: true
                        }
                    ]
                },
                include: [
                    {
                        model: models.attachment,
                        attributes: ["id", ["path", "image_url"], ["thumbnail", "thumb_url"], "type", "key_type"],
                    }
                ]
            })
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.ACTION_COMPLETE, language || 'en'), Success.OK, feedbackDetail )
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SOMETHING_WENT_WRONG, language || 'en'), serverError.Internal_Server_error);
        }
    }
}
export default feedback;