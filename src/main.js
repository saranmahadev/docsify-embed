function youtube_embed(content) {
    var re = /%\[youtube\]\((.*?)\)/g;
    matches = re.exec(content);
    while (matches) {
        var id = matches[1];
        var embed = '<iframe src="https://www.youtube.com/embed/' + id + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" width="100%" height="400" allowfullscreen></iframe>';
        content = content.replace(matches[0], embed);
        matches = re.exec(content);
    }
    return content;
}

function codepen_embed(content) {
    var re = /%\[codepen\]\((.*?)\)/g;
    matches = re.exec(content);
    while (matches) {
        var format = matches[1].split('-');
        console.log(format);
        var embed = `<iframe height="265" scrolling="no" title="codepen_embed" src="https://codepen.io/${format[0]}/embed/${format[1]}/?height=300&theme-id=${format[2]}&default-tab=result&embed-version=2" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 100%;"></iframe>`;
        content = content.replace(matches[0], embed);
        matches = re.exec(content);        
    }
    return content;
}


function twitter_embed(content) {
    var re = /%\[twitter\]\((.*?)\)/g;
    matches = re.exec(content);
    while (matches) {
        var url = matches[1];
        var embed = '<blockquote class="twitter-tweet"><p lang="en" dir="ltr"><a href="' + url + '"></a></p></blockquote>';
        content = content.replace(matches[0], embed);
        matches = re.exec(content);
    }
    return content;
}


function github_embed(content) {
    var re = /%\[github\]\((.*?)\)/g;
    var matches = re.exec(content);
    while (matches) {        
        var embed = `<a href="https://github.com/${matches[1]}"><img src="https://gh-card.dev/repos/${matches[1]}.svg?fullname=''"></a>`
        content = content.replace(matches[0], embed);
        matches = re.exec(content);
    }
    return content;
}

function instagram_embed(content) {
    var re = /%\[instagram\]\((.*?)\)/g;
    var matches = re.exec(content);
    while (matches) {       
        var embed = `<blockquote class="instagram-media"><a href="${matches[1]}"></a></blockquote>`;
        content = content.replace(matches[0], embed);
        matches = re.exec(content);
    }
    return content;
}

function spotify_embed(content) {
    var re = /%\[spotify\]\((.*?)\)/g;
    var matches = re.exec(content);
    while (matches) {       
        var format = matches[1].split('-');
        var embed = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/${format[0]}?theme=${format[1]}" width="100%" height="80" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
        content = content.replace(matches[0], embed);
        matches = re.exec(content);
    }
    return content;
}

function main(hook,vm) {   
    
    var supported = /^(codepen|twitter|github|gist|youtube|soundcloud|vimeo|instagram|anchor|spotify|runkit)$/i;
    
    hook.init(function() {
        // Codepen Embed
        let codepen_plugin = document.createElement('script');
        codepen_plugin.src = 'https://static.codepen.io/assets/embed/ei.js';
        codepen_plugin.async = true;
        document.body.appendChild(codepen_plugin);

        // Twitter Embed
        let twitter_plugin = document.createElement('script');
        twitter_plugin.src = 'https://platform.twitter.com/widgets.js';
        twitter_plugin.async = true;
        document.body.appendChild(twitter_plugin);

        // Instagram Embed
        let instagram_plugin = document.createElement('script');
        instagram_plugin.src = 'https://www.instagram.com/embed.js';
        instagram_plugin.async = true;
        document.body.appendChild(instagram_plugin);
    });

    hook.beforeEach(function(content) {
        var re = /%\[(.*?)\]\((.*?)\)/g;
        var matches = re.exec(content);
        
        while (matches) {
            if (supported.test(matches[1].toLocaleLowerCase())) {
                switch (matches[1]) {
                    case 'youtube':
                        content = youtube_embed(content);
                        break;
                    case 'codepen':
                        content = codepen_embed(content);
                        break;
                    case 'twitter':
                        content = twitter_embed(content);
                        break;
                    case 'github':
                        content = github_embed(content);
                        break;
                    case 'instagram':
                        content = instagram_embed(content);
                        break;
                    case 'spotify':
                        content = spotify_embed(content);
                        break;
                }
            }            
            matches = re.exec(content);
        }
        
    return content;
    });

    hook.afterEach(function(html, next) {
        // Embed Comments
        html = html.replace(/%\/\//g, '%');
        next(html);
      });
}

window.$docsify.plugins = [].concat(main, window.$docsify.plugins);
