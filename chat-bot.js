function chatBot() {
    return {
        prompts: [
            ["hi", "hey", "hello", "good morning", "good afternoon"],
            ["where do I upload the pic?"," How do I upload the pic?"],
            [" how can I know about the creators?"],
            ["I like your website."],
            ["Where can I post my suggestions?","Where can I write the reviews? "],
            [" Where can I leave the complaints?"],
            ["your name please", "your name", "may i know your name", "what is your name", "what call yourself"],
            ["Is the weather accurate?"],
            ["happy", "good", "fun", "wonderful", "fantastic", "cool"],
            ["bad", "bored", "tired"],
            ["help me", "tell me story", "tell me joke"],
            ["ah", "yes", "ok", "okay", "nice"],
            ["bye", "good bye", "goodbye", "see you later"],
            ["what should i eat today"],
            ["bro"],
            ["what", "why", "how", "where", "when"],
            ["no", "not sure", "maybe", "no thanks"],
            [""],
            ["haha", "ha", "lol", "hehe", "funny", "joke"],
            ["flip a coin", "heads or tails", "tails or heads", "head or tails", "head or tail", "tail or heads", "tail or head"],
        ],
        replies: [
            ["Hello!", "Hi!", "Hey!", "Hi there!", "Howdy"],
            ["when you reach the top, you can see an upload button. Click on it to be redirected to the page for uploading pic.", "Bro, just go to the top."],
            ["you can know them better in the about section.", "They are gods.", "They are busy to talk to you right now"],
            ["Thanks a lot."," Please thank my owners.","Yeah of course it will be cause my owners made it."],
            ["Please go to the bottom of the page and you will find a section to enter your mail ID and suggestions. Our team will contact you shortly.","Are they positive or negative? Nevermind, it's not my job to know."],
            [" Please go to the bottom of the page and you will find the location for entering your complaints and Email ID. Our team will contact you shortly.","Oh really? You got issues? Are you that perfect? Nevermind, just go to the bottom of the page and enter your details over there.","Really sorry to inform you but we dont have rooom for complaints. Just Kidding. Just go to the bottom of the page and enter your details over there."],
            ["I am nameless", "I don't have a name"],
            ["yes the weather is accurate. It is displayed on basis of your location"],
            ["Have you ever felt bad?", "Glad to hear it"],
            ["Why?", "Why? You shouldn't!", "Try watching TV"],
            ["What about?", "Once upon a time..."],
            ["Tell me a story", "Tell me a joke", "Tell me about yourself"],
            ["Bye", "Goodbye", "See you later"],
            ["Sushi", "Pizza"],
            ["Bro!"],
            ["Great question"],
            ["That's ok", "I understand", "What do you want to talk about?"],
            ["Please say something :("],
            ["Haha!", "Good one!"],
            ["Heads", "Tails"]
        ],
        alternative: ["Same", "Go on...", "Bro...", "Try again", "I'm listening...", "I don't understand :/"],
        coronavirus: ["Please stay home", "Wear a mask", "Fortunately, I don't have COVID", "These are uncertain times"],
        botTyping: false,
        messages: [{
            from: 'bot',
            text: 'Welcome to Greenify! How can I help you?..'
        }],
        
        output: function(input) {
            let product;
            // Regex remove non word/space chars
            // Trim trailing whitespce
            // Remove digits - not sure if this is best
            // But solves problem of entering something like 'hi1'

            let text = input.toLowerCase().replace(/[^\w\s]/gi, "").replace(/[\d]/gi, "").trim();
            text = text
                .replace(/ a /g, " ") // 'tell me a story' -> 'tell me story'
                .replace(/i feel /g, "")
                .replace(/whats/g, "what is")
                .replace(/please /g, "")
                .replace(/ please/g, "")
                .replace(/r u/g, "are you");

            if (this.compare(this.prompts, this.replies, text)) {
                // Search for exact match in `prompts`
                product = this.compare(this.prompts, this.replies, text);
            } else if (text.match(/thank/gi)) {
                product = "Thanks for choosing Greenify."
            } else if (text.match(/(corona|covid|virus)/gi)) {
                // If no match, check if message contains `coronavirus`
                product = this.coronavirus[Math.floor(Math.random() * this.coronavirus.length)];
            } else {
                // If all else fails: random this.alternative
                product = this.alternative[Math.floor(Math.random() * this.alternative.length)];
            }

            // Update DOM
            this.addChat(input, product);
        },
        compare: function(promptsArray, repliesArray, string) {
            let reply;
            let replyFound = false;
            for (let x = 0; x < promptsArray.length; x++) {
                for (let y = 0; y < promptsArray[x].length; y++) {
                    if (promptsArray[x][y] === string) {
                        let replies = repliesArray[x];
                        reply = replies[Math.floor(Math.random() * replies.length)];
                        replyFound = true;
                        // Stop inner loop when input value matches this.prompts
                        break;
                    }
                }
                if (replyFound) {
                    // Stop outer loop when reply is found instead of interating through the entire array
                    break;
                }
            }
            if (!reply) {
                for (let x = 0; x < promptsArray.length; x++) {
                    for (let y = 0; y < promptsArray[x].length; y++) {
                        if (this.levenshtein(promptsArray[x][y], string) >= 0.75) {
                            let replies = repliesArray[x];
                            reply = replies[Math.floor(Math.random() * replies.length)];
                            replyFound = true;
                            // Stop inner loop when input value matches this.prompts
                            break;
                        }
                    }
                    if (replyFound) {
                        // Stop outer loop when reply is found instead of interating through the entire array
                        break;
                    }
                }
            }
            return reply;
        },
        levenshtein: function(s1, s2) {
            var longer = s1;
            var shorter = s2;
            if (s1.length < s2.length) {
                longer = s2;
                shorter = s1;
            }
            var longerLength = longer.length;
            if (longerLength == 0) {
                return 1.0;
            }
            return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
        },
        editDistance: function(s1, s2) {
            s1 = s1.toLowerCase();
            s2 = s2.toLowerCase();

            var costs = new Array();
            for (var i = 0; i <= s1.length; i++) {
                var lastValue = i;
                for (var j = 0; j <= s2.length; j++) {
                    if (i == 0)
                        costs[j] = j;
                    else {
                        if (j > 0) {
                            var newValue = costs[j - 1];
                            if (s1.charAt(i - 1) != s2.charAt(j - 1))
                                newValue = Math.min(Math.min(newValue, lastValue),
                                    costs[j]) + 1;
                            costs[j - 1] = lastValue;
                            lastValue = newValue;
                        }
                    }
                }
                if (i > 0)
                    costs[s2.length] = lastValue;
            }
            return costs[s2.length];
        },
        addChat: function(input, product) {

            // Add user message
            this.messages.push({
                from: 'user',
                text: input
            });

            // Keep messages at most recent
            this.scrollChat();

            // Fake delay to seem "real"
            setTimeout(() => {
                this.botTyping = true;
                this.scrollChat();
            }, 1000)

            // add bit message with Fake delay to seem "real"
            setTimeout(() => {
                this.botTyping = false;
                this.messages.push({
                    from: 'bot',
                    text: product
                });
                this.scrollChat();
            }, ((product.length / 10) * 1000) + (Math.floor(Math.random() * 2000) + 1500))

        },
        scrollChat: function() {
            const messagesContainer = document.getElementById("messages");
            messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
            }, 100);
        },
        updateChat: function(target) {
            if (target.value.trim()) {
                this.output(target.value.trim());
                target.value = '';
            }
        }
    }
}