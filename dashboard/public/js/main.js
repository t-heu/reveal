// (function() {
//   window.onscroll = function (e) {  
//     const scr = document.getElementById("site")
//     if (e.isTrusted) {
//       scr.style.height = "auto"
//     }
//   } 
// })()

// function loadPreview(event) {
//   const output = document.getElementById('output')
//   const photoPreview = document.getElementById('photoPreview')
//   output.src = URL.createObjectURL(photoPreview.files[0])
// }

function handleSubmitSwitchMaintenance(role) {
  const button = document.querySelector("#customSwitch1")

  if (!role) return

  fetch(`http://localhost:3333/maintenance?check=${button.checked}&role=${role}`, { 
    method: 'GET',
    headers: new Headers(),
    mode: 'cors',
    cache: 'default'
  })
  .then(function(response) {
    // console.log(response)
    return response;
  })
  .catch((err) => {
    alert('Access Denied - 403')
  })
}

function profileHeader() {
  const profile = document.querySelector("#a")
  if (profile.style.bottom == '200px') {
    profile.style.bottom = "-60px"
  } else {
    profile.style.bottom = "200px"
  }
}