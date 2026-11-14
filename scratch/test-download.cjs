const fs = require('fs');

const raw = "https://scontent.cdninstagram.com/v/t51.2885-19/19226979_222740814901692_8103913382660276224_a.jpg?stp=dst-jpg_s150x150_tt6&amp;_nc_cat=107&amp;ig_cache_key=GGNhJQG8MSbjlMoAAAAAAABJ4nZwYUULAAAB1501500j-ccb7-5&amp;ccb=7-5&amp;_nc_sid=669407&amp;efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4yMDAuQzMifQ%3D%3D&amp;_nc_ohc=zOKXZ5yr1okQ7kNvwHw7Fcw&amp;_nc_oc=Adp26yvURufQ0ZAywsCVazq53VSSxeAA8BQuw4Athfvr0cJxPiniLipWRaa8CGfT-yM0L7HknUsZMMZeeB2gABkF&amp;_nc_zt=24&amp;_nc_ht=scontent.cdninstagram.com&amp;_nc_ss=7f689&amp;_nc_ct=RQosPBUCFQIAAAA&amp;oh=00_AQRmnA9-AKPIKmo28ymxMlWlkB5dUob6jrPK_-qJMotspQ&amp;oe=6AFE2239";
const url = raw.replace(/&amp;/g, '&');

fetch(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  }
}).then(r => r.arrayBuffer()).then(b => {
  fs.writeFileSync('public/images/portfolio/social/letsgotrippin.jpg', Buffer.from(b));
  console.log('Successfully saved letsgotrippin.jpg, bytes:', b.byteLength);
}).catch(console.error);
