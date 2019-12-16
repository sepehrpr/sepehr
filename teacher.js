const bcrypt=require('bcryptjs')
let pass='123';
/*let salt = bcrypt.genSaltSync(15)
console.log(salt)

let hash=bcrypt.hashSync(pass,salt)
console.log(hash)
*/
hash='$2a$10$W/AOrTA/0V92VbkGOpTqHeK5gUNsHUgLBn6O.ijMGxC/1QOvfN7y.'

let a=bcrypt.compareSync(pass,hash)
console.log(a)
