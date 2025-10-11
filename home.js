document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get form data
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const gender = document.getElementById("gender").value;

    // Send data to backend for validation
    alert("Starting fetch");

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, gender }),
    })
    
  .then(response => {
      alert("Received response");
      return response.json();
  })
  .then(data => {
      alert("Data processed");
      if (data.success) {
          window.location.href = 'quiz.html';
      } else {
          alert(data.message || 'Login failed');
      }
  })
  .catch(error => {
      alert("Error occurred: " + error);
      console.error('Error:', error);
  });

});
