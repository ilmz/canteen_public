const TicketSystem =  require('../../models/ticketSystem')


class ticketService {

    createTicket = async ( params) => {
        return await TicketSystem.create(params);
      }
   
      updateTicket = (ticketId, params) => TicketSystem.findOneAndUpdate({_id: ticketId}, { $set: params }, {new: true})


      getTicket = async (params) => {
        const ticket = await TicketSystem.findOne(params).populate(
            {
                path    : 'attachmentId',
                select  : ' -__v ',
                options : { sort: { 'createdAt': -1 } }

            }
        );
        return ticket;
      }
    getTickets = async (params) => {
        const ticket = await TicketSystem.find(params).sort({ createdAt: -1 }).populate(
            {
                path    : 'attachmentId',
                select  : ' -__v ',
                options : { sort: { 'createdAt': -1 } }

            }
        );
        return ticket;
      }
      countTicket =  async ({limit, skip, isDeleted, isActive}) => {
        return await TicketSystem.count({isDeleted, isActive}).limit(limit).skip(skip)
      }
    }
    
    module.exports = new ticketService();