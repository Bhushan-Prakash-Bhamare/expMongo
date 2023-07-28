const form=document.getElementById('Data-form');
const pwShowHide = document.querySelector(".eye-icon");
form.addEventListener('submit',formSubmit);
pwShowHide.addEventListener('click',pwdclick);

function pwdclick(){
  let pwFields = form.querySelector(".password");

      if(pwFields.type === "password"){
        pwFields.type = "text";
          pwShowHide.classList.replace("bx-hide", "bx-show");
          return;
      }
      pwFields.type = "password";
      pwShowHide.classList.replace("bx-show", "bx-hide");
}

async function formSubmit(e){
  try{
      e.preventDefault();  
      const details={
          email:e.target.email.value,
          password:e.target.password.value
      }
      
      const response=await axios.post(`http://localhost:3000/user/login`,details);  
          console.log(response.data.message); 
          localStorage.setItem('token',response.data.token);
          window.location.href = "../html/addexpense.html";   
      
  }
  catch(err){ 
      console.log(err.message);
      document.body.innerHTML +=`<div style="color:red;">${err.message}</div>`;
  }
}