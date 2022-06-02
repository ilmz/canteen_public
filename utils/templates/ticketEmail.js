let email = `
         <tbody style="text-align:left; background: #fff;">
            <tr>
               <td class="p-left p-right" style="padding-top:30px;padding-right:40px;padding-bottom:0px;padding-left:40px;border-left:1px solid #F3F4F4;border-right:1px solid #F3F4F4;">
                  <h3 style="margin:0;color:color: #03060B;;font-family:'-apple-system', BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';font-size:24px;line-height:28px;padding-bottom:0px;letter-spacing: 0.24px;">Hello {{name}},</h3>
                  <p style="color: #323A49;font-family:'-apple-system', BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';font-size:20px;line-height:32px;margin:0;font-weight: 500;">
                  </p>
                  <BR>
                  <p>
                  {{senderName}} has raised a ticket.
                  <BR>
                  <BR>
                  </p>
                  <p>
                   title: {{title}}
                  <BR>
                  description:{{description}}
                  <BR>
                  ticketStatus: Pending
                  </p>
                  <p>
                  Thanks,
                  <BR>
                 illuminz Support Team
                  </p>

               </td>
            </tr>
            <!--
            <tr>
               <td height="32" style="border-left:1px solid #F3F4F4;border-right:1px solid #F3F4F4;" class="height10"></td>
            </tr>
            <tr>
               <td height="234" style="border-left:1px solid #F3F4F4;border-right:1px solid #F3F4F4;">
                     <img src="https://gallery.mailchimp.com/b967d871c939e76ecbaddd30d/images/569e2393-0fc7-4f5b-9f8a-db47250c01bd.jpg" style="width:100%; max-width: 600px;" alt=""/></td>
            </tr>
            -->
            `

module.exports = {
   ticketEmail: email,
};


