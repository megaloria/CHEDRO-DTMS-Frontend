
const Validation = (values) => {
        let errors = {}


        if (!values.username){

            errors.username = "Username Required"

    
        }
         else if (values.username.length < 5) {
            errors.username = "Username atleast 5 Characters"
         }


         
        if (!values.password){

            errors.password = "Username Required"

    
        }
         else if (values.password.length < 5) {
            errors.password = "Password atleast 8 Characters"
         }

         return errors;
}

export default Validation;