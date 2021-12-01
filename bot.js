var Twit = require('twit');
var config = require('./config.js');

var fs = require('fs');

var text = fs.readFileSync("./musicas.txt", 'utf-8');
var respostas = text.split('\n');


var T = new Twit(config);
var id = {};
var prevId = {};
var respostasNegativas =[
                        'Você quer o que, mulesta?',
                        'Bafude!',
                        'Me deixe em paz.',
                        'Te odeio, sabia?',
                        'Seu Alcides corre aqui!',
                        'É pau?',
                        'O que é infernooo?',
                        'Não venha não, mulher!',
                        'Fã de equipe?',
                        'Lacractos?'   
                        ];

var stream = T.stream('statuses/filter', { track: ['@cactoraiser'] });
stream.on('tweet', tweetEvent);

function tweetEvent(tweet) {
    //console.log(tweet);
    // Who sent the tweet?
    var name = tweet.user.screen_name;
    // What is the text?
    var txt = tweet.text;
    console.log(txt);
    txt = txt.replace('@cactoraiser', '');
    console.log(txt);
    txt = txt.replace('@CactoRaiser', '');
    console.log(txt);
    txt = txt.trim();
    var tag = txt.substring(txt.indexOf(': ') + 1);
    console.log(tag);
   
    var nameID  = tweet.id_str;
    var message = {};

    if (txt.includes('bora subir: ') || txt.includes('Bora subir: ') || txt.includes('Bora Subir: '))
    {
        T.post('favorites/create', { id: nameID })
        .then(result => {

        console.log('Liked tweet successfully!')});

        for (const types of respostas)
        {  
            message = '@' + name + ' ' + tag + ' ' + types;
            console.log(message);
            
            newTweetsTags(message, nameID);             
        } 
    }
    else
    {
        message = '@' + name + ' Não entendi. ' + respostasNegativas[Math.floor(between(1,10) - 1)];
        newTweetsTags(message, nameID);   
    }
};

function newTweetsTags(message, nameID)
{

    var tweet =
    {
        status: message,
        in_reply_to_status_id: nameID
    };

    T.post('statuses/update', tweet, response);

    function response(error,tweet)
    {
        if(error)
        {
            console.log(error)
        }
        else
        {
            console.log(tweet.text)
        }
    }
};

function between(min, max) {  
    return Math.random() * (max - min + 1) + min;
  };