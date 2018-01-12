axios({
    url: "https://slacktutors.herokuapp.com/forismatic/quotes",
    method: "GET"
})
    .then((response) => {
        console.log(response.data);
    })
    .catch((err) => {
        console.log(err);
        console.log("Error getting words");
    });