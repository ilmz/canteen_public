const constant = require("../../constants/constants");
let email = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
   <head>
      <meta http-equiv="content-type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width">
      <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900" rel="stylesheet">
      <style type="text/css">
         @media screen and (max-width:475px){
         .p-left{
         padding-left:15px !important;
         }
         }  @media screen and (max-width:475px){
         .p-right{
         padding-right:15px !important;
         }
         }  @media screen and (max-width:475px){
         .radius0{
         border-radius:0 !important;
         }
         }  @media screen and (max-width:475px){
         .padding0{
         padding-top:0 !important;
         }
         }
      </style>
   </head>
   <body class="padding0" style="font-size:16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; margin:0px;background-color:#F3F6F9;padding-top:15px;padding-bottom:15px;">
      <table style="max-width:600px;width:100%;background:transparent;border-radius:12px;" cellpadding="0" cellspacing="0" align="center">
         
         <tbody style="text-align:left;background:#fff;">
            <tr>
               <td class="p-left p-right radius0" style="text-align:center;padding-top:34px;padding-right:30px;padding-bottom:22px;padding-left:30px;background-color:#FFFFFF	;border-radius:12px 12px 0 0;">
                  <img src=${constant.EMAIL_TEMPLATE_URLS.WEBISTE_LOGO} style="width:140px;vertical-align: middle;" alt="">
               </td>
            </tr>
            <tr>
            <!--contant -->
            {{{html}}}            
            <tfoot style="text-align:center;width:100%;">
            <tr>
               <td style="background:#FFF;border-left:1px solid #F3F4F4;border-right:1px solid #F3F4F4;">
                  <p style="font-family:'-apple-system', BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';color:#323A49;margin:0;font-size:16px;font-weight:500;line-height:19px;padding-bottom:16px;">Download the Illuminz app!</p>
                  <ul style="margin:0;list-style:none;padding:0;">
                     <li style="display:inline-block;padding:0 5px;margin: 0;"><a href=""><img src="https://gallery.mailchimp.com/b967d871c939e76ecbaddd30d/images/ad9a5201-20e2-4225-843b-9580c85d5d1e.png" alt="" style="height: 38px;"></a>
                     </li>
                     <li style="display:inline-block;padding:0 5px;margin: 0;"><a href=""><img src="https://gallery.mailchimp.com/b967d871c939e76ecbaddd30d/images/13fdb529-4653-4981-b07d-ec43ca27089d.png" alt="" style="height: 38px;"></a>
                     </li>
                  </ul>
               </td>
            </tr>
            <tr>
               <td style="height:33px;background:#fff;border-left:1px solid #F3F4F4;border-right:1px solid #F3F4F4;"></td>
            </tr>
            <tr>
               <td class="radius0" style="background-color:#FFFFFF;border-radius:0 0 12px 12px;">
                  <table style="width:100%;">
                     <tr>
                        <td style="height:25px;"></td>
                     </tr>
                     <tr>
                        <td>
                           <img src=${constant.EMAIL_TEMPLATE_URLS.WEBISTE_LOGO} style="width:120px;vertical-align: middle;" alt="">
                        </td>
                     </tr>
                     <tr>
                        <td style="height:18px;"></td>
                     </tr>
                     <tr>
                        <td style="padding-bottom:20px;">
                           <ul style="padding:0;list-style:none;display:inline-block;margin:0;">
                              <li style="display:inline-block;padding-right:5px;margin:0;"><a href="https://www.facebook.com/groups/thevegetarianelite" style="width:24px;height:24px;display:inline-block;line-height:24px;border-radius:2px;"><img src="https://gallery.mailchimp.com/b967d871c939e76ecbaddd30d/images/92880fc1-5256-46ad-9ed2-fdbcfe27a6a5.png" alt="" style="padding-top: 5px; width:100%"></a>
                              </li>
                              <li style="display:inline-block;padding-right:5px;margin:0;"><a href="https://twitter.com/Koouth" style="width:24px;height:24px;display:inline-block;line-height:24px;border-radius:2px;"><img src="https://gallery.mailchimp.com/b967d871c939e76ecbaddd30d/images/d12b1204-89ab-4d74-bda0-e1c96963f105.png" alt="" style="padding-top: 5px; width:100%"></a>
                              </li>
                              <li style="display:inline-block;padding-right:5px;margin:0;"><a href="https://www.instagram.com/Koouth_" style="width:24px;height:24px;display:inline-block;line-height:24px;border-radius:2px;"><img src="https://gallery.mailchimp.com/b967d871c939e76ecbaddd30d/images/73c6d100-7781-437b-af6c-30cf8623aec6.png" alt="" style="padding-top: 5px; width:100%"></a>
                              </li>
                           </ul>
                        </td>
                     </tr>
                  </table>
               </td>
            </tr>
         </tfoot>
      </table>
   </body>
</html>`

module.exports = {
   headerfooter: email
};
