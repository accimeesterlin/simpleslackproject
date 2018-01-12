


const seconds = ((24 * 60) * 60) * 3; // 3 days in second
const current_time = moment().unix();


/**
 * Making AJAX Request for POST or GET
 * @param {*} param0 
 * @param {*} cb 
 */

// lib
const ajax_request = (obj, cb) => {
    let url = obj.url;
        method = obj.method;
        data = obj.data;

    let options = {
        url,
        method,
    };
    if (method === "GET") {
        delete options['data'];
        axios(options)
            .then((response) => cb({ data: response.data }))
            .catch((err) => cb({ err }));
    } else {
        options['data'] = data;
        axios(options)
            .then((response) => cb({ data: response.data }))
            .catch((err) => cb({ err }));
    }
} // verified


/**
 * Getting quotes from Forismatic API
 */
const get_quote = () => {
    const rq_object = {
        url: 'https://slacktutors.herokuapp.com/forismatic/quotes',
        method: "GET"
    }
    ajax_request(rq_object, ({ data }) => {
        console.log("Quote: ", data);
        check_quote(data);
    })
} // verified



const format_quote = (quoteAuthor, quoteText, quoteLink) => {
    let status = false;

    const quote = {
        channel: '#wisebot',
        username: 'WiseBot',
        icon_emoji: ':nerd_face:',
        attachments: [
            {
                fallback: "New quote of the day just for you :)",
                color: "#36a64f",
                author_name: "Author: " + quoteAuthor,
                author_link: quoteLink,
                title: "Quote of the Day: ",
                title_link: "https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en",
                text: quoteText,
                footer: "Built by Central Support Tutors @accimeesterlin & @jdtadlock",
                ts: current_time
            }
        ]
    };

    filter_word((bad_words) => {
        for (let i = 0; i < bad_words.length; i++) {
            if (quoteText.includes(bad_words[i])) {
                // console.log("There is  bad word");
                status = true;
            } else {
                // console.log("There is no bad word");
                status = false;
            }
        }


        // Only post the slack, when there is no bad
        if (status) {
            console.log("Oooops, there is bad words");
            console.log("Status: ", status);
        } else {
            console.log("About to post to Slack");
            post_to_slack(quote);
        }
    });

}


/** 
 * Checking for any undefined values from quotes
 * @param {*} param0 
 */
const check_quote = (obj) => {
    let quoteText = obj.quoteText || '';
    quoteAuthor = obj.quoteAuthor || 'Unknown Author';
    quoteLink = obj.quoteLink || 'https://api.forismatic.com';
    format_quote(quoteAuthor, quoteText, quoteLink);
}

const post_to_slack = (quote) => {
    const rq_object = {
        url: "https://slacktutors.herokuapp.com/send/message",
        data: quote,
        method: "POST"
    }

    console.log("I am getting this");
    ajax_request(rq_object, (response) => {
        if (response.data) {
            console.log("Data has been posted to Slack");
        } else {
            console.log("We got an error");
            console.log("Error: ", response.err);
        }
    })
} // verified

const filter_word = (cb) => {
    axios({
        url: "https://slacktutors.herokuapp.com/api/quotes",
        method: "GET"
    })
        .then((quotes) => {
            let bad_words = [];
            for (let i = 0; i < quotes.data.length; i++) {
                bad_words.push(quotes.data[i].word);
                // console.log("Quotes: ", quotes.data[i].word);
            }
            cb(bad_words);
        })
        .catch((err) => {
            console.log("Error getting words");
        });
};



setInterval(() => {
    get_quote();
    console.log("Hello World");
}, (60 * 2) * 1000);
