var selected = document.getElementsByClassName("select");
var category, difficulty, url, score = 0,
    total_score = 0,
    correct_answers = [10],
    inputId = ['first', 'second', 'third', 'four'];

document.getElementsByClassName("btn")[0].addEventListener("click", quiz);

function quiz() {

    category = selected[0].value;
    difficulty = selected[1].value;
    if (category == "any") category = '';
    if (difficulty == "any") difficulty = '';
    url = 'https://opentdb.com/api.php?amount=10&category=' + category + '&difficulty=' + difficulty;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            //hide main page and unhide question's page
            document.getElementById("main").style.display = "none";
            var questions = document.getElementById("questions");
            questions.style.display = "block";

            //generate questions and answers
            for (var i = 0; i < 10; i++) {
                var txt = document.createElement("textarea");
                txt.innerHTML = data.results[i].question;
                //create list item and write question inside it
                var node = document.createElement("li");
                node.innerHTML = (txt.value);
                questions.appendChild(node);

                //api data includes some html entities,we can decode them in the following way
                txt.innerHTML = data.results[i].correct_answer;
                var res = [],
                    correct = txt.value;
                correct_answers[i] = correct;

                for (var a = 0; a < data.results[i].incorrect_answers.length; a++) {
                    txt.innerHTML = data.results[i].incorrect_answers[a];
                    res[a] = txt.value;
                }
                var rand = Math.floor(Math.random() * 4);
                res.splice(rand, 0, correct);

                var input = document.createElement("input");
                input.type = "radio";
                input.id = inputId[0] + i.toString();
                input.name = "checked" + i.toString();
                input.value = res[0];
                questions.appendChild(input);

                var label = document.createElement("label");
                label.for = inputId[0] + i.toString();
                label.innerText = res[0];
                label.style.margin = "2vmin";
                label.style.fontWeight = "normal";
                questions.appendChild(label);

                //each answer on new line
                var br = document.createElement("br");
                questions.appendChild(br);

                //clone input and label tags for answers
                for (var j = 1; j < res.length; j++) {
                    var input = input.cloneNode(true);
                    input.id = inputId[j] + i.toString();
                    input.value = res[j];
                    questions.appendChild(input);
                    var label = label.cloneNode(true);
                    label.for = inputId[j] + i.toString();
                    label.innerText = res[j];
                    questions.appendChild(label);
                    var cln = br.cloneNode(true);
                    questions.appendChild(cln);
                }

            }

            var node = document.createElement("button");
            node.innerText = "Submit";
            node.style.marginTop = "5vmin";
            node.style.width = "30vmin";
            node.class = "btn2";
            questions.appendChild(node);

            document.getElementsByTagName("button")[1].addEventListener("click",
                function() {
                    document.body.style.backgroundColor = "#0875bb";
                    //loop through questions 
                    for (var i = 0; i < 10; i++) {
                        var radios = document.getElementsByName("checked" + (i).toString());
                        //loop through answers
                        for (var j = 0, length = radios.length; j < length; j++) {
                            //check correct answers
                            if (radios[j].checked == true && radios[j].value == correct_answers[i]) {
                                score += 1;
                                // only one radio can be logically checked, don't check the rest
                                break;
                            }
                        }
                    }
                    total_score += score;
                    //unhide questions page to alert result
                    questions.style.display = "none";
                    //alert the result
                    Swal.fire({
                        showDenyButton: true,
                        title: 'Your score: ' + total_score,
                        text: 'If you want to retake quiz,click retake',
                        confirmButtonText: `retake`,
                        denyButtonText: `check correct answers`,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            score = 0;
                            questions.innerHTML = '';
                            quiz();
                        } else if (result.isDenied) {
                            //here we are going back to questions page to see correct answers,so we need substract repeatedly added current score from total_score
                            total_score -= score;
                            score = 0;
                            swal.close()
                            questions.style.display = "block";


                            for (var i = 0; i < 10; i++) {
                                var radios = document.getElementsByName("checked" + (i).toString());
                                //loop through answers
                                for (var j = 0, length = radios.length; j < length; j++) {
                                    //check correct answers
                                    if (radios[j].value == correct_answers[i]) {
                                        radios[j].nextElementSibling.style.background = '#00CF00';
                                        break;
                                    }
                                }
                            }




                        }
                    });
                });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};
