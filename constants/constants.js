const Success = {
    PARAMETER_MISSING               : 100,
    INVALID_ACCESS_TOKEN            : 101,
    OK                              : 200,
    ACTION_COMPLETE                 : 200,
    CREATED                         : 201,
    Upload_error                    : 201,
    USER_NOT_FOUND                  : 201,
    Accepted                        : 202,
    Non_AuthoritativeInformation    : 203,
    No_Content                      : 204,
    Reset_Content                   : 205,
    Partial_Content                 : 206,
    Multi_Status                    : 207,
    Already_Reported                : 208,
    IM_Used                         : 226
}
const BadRequest = {
    INVALID                         : 400,
    Unauthorized                    : 401,
    Payment_Required                : 402,
    Forbidden                       : 403,
    NotFound                        : 404,
    ERROR_IN_EXECUTION              : 404,
    Method_Not_Allowed              : 405,
    Not_Acceptable                  : 406,
    Proxy_Authentication_Required   : 407,
    Request_Timeout                 : 408,
    Conflict                        : 409,
    Gone                            : 410,
    Unavailable_For_Legal_Reasons   : 451,
    Length_Required                 : 411
}
/** 5XX Server errors */
const serverError = {
    ACCOUNT_NOT_REGISTERED          : 500,
    Internal_Server_error           : 500,
    Not_Implemented                 : 501,
    Bad_Gateway                     : 502,
    Service_Unavailable             : 503,
    gateway_Timeout                 : 504,
    Insufficient_Storage            : 507,
    Network_Authentication_Required : 511
}
const STATUS = {
    ACTIVE   : 1,
    INACTIVE : 0
}

const role = {
    "user"    : 0,
    "admin"   : 1,
}
const productStatuses = {
    "pending"    : 0,
    "approved"   : 1,
    "rejected"   : 2
}

const permission = {
    "user"    : 1,
    "subAdmin": 5,
    "Admin"   : 6
}
const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    DECLINED: 'declined',
    REVERTED: 'reverted'
  };
const PAYMENT_METHODS =  {
    CARD: 'card',
    ONLINE: 'online',
    OFFLINE: 'offline',
  };
const  ATTACHMENTS =  {
    FILE: 'file',
    IMAGE: 'image',
    VIDEO: 'video',
    FONT: 'font'
};
const TICKET_STATUS = {
    "PENDING"   : 1,
    "INPROGRESS": 2,
    "COMPLETE"  : 3,
    "REOPEN"    : 4
}
const ORDER_TYPES = {
    "PLACED"   : 1,
    "REVERTED" : 2,
}

const MENU_ITEM_TYPES =  {
   };


const PAGINATION_LIMIT = {
    LIMIT   : 20,
}

const requestMethods = {
    GET    : "GET",
    POST   : "POST",
    DELETE : "DELETE",
    PUT    : "PUT"
};
let NOTIFICATION_TYPE = {
    ORDER_PLACED: {
      title: `Order Placed`,
      body: `{userName} has placed order`
    },
    ORDER_REVERTED: {
      title: `Order Reverted`,
      body: `{userName} has Reverted Items`
    },
    AMOUNT_UPDATED: {
      title: "Amount updated",
      body:  "Admin updated your amount"
    },
    TICKET_RAISED:{
        title: "Ticket Raised",
        body: "{UserName} has raised a ticket"
    }
   
  }

 const EMAIL_TYPE= {
    TICKET_EMAIL: 'TICKET_EMAIL',
  }
 const EMAIL_TEMPLATE_URLS =  {
    WEBISTE_LOGO: 'http://54.176.169.179:3000/uploads/thumbnail/photo-1654082187001.png',
  }
  const type = {
      "ios_device": 0,
      "android_device": 1
  }

  


module.exports =  { Success, STATUS, BadRequest, serverError, role, permission, 
    PAGINATION_LIMIT, requestMethods, PAYMENT_STATUS, PAYMENT_METHODS, ATTACHMENTS, MENU_ITEM_TYPES, NOTIFICATION_TYPE, TICKET_STATUS, EMAIL_TYPE, EMAIL_TEMPLATE_URLS, type, ORDER_TYPES, productStatuses }