const githubUserName = 'howeverina' // 깃허브 아이디
const githubRepoName = 'howeverina.github.io' // 깃허브 레포지토리 이름

function getQueryStringObject() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}

// スマホ用メニュー　クラス追加
const ham = document.querySelector("#js-hamburger");
const nav = document.querySelector("#js-globalnav");

ham.addEventListener("click", function () {
 ham.classList.toggle("_active");
 nav.classList.toggle("_active");
});

window.addEventListener("scroll", function () {
 const scroll = window.pageYOffset;
 if (scroll > 180) {
  ham.classList.add("colorchange");
 } else ham.classList.remove("colorchange");
});

// 子メニュー表示
const parentMenu = document.querySelectorAll(".globalnav ._has-child > a");
for (let i = 0; i < parentMenu.length; i++) {
 parentMenu[i].addEventListener("click", function(e){
  e.preventDefault();
  this.nextElementSibling.classList.toggle("active");
 })
}


// COMIC用メニュー　クラス追加
const comicbtn = document.querySelector("#js-comicnav-btn");
const comicnav = document.querySelector("#js-comicnav");

comicbtn?.addEventListener("click", function () {
 comicbtn.classList.toggle("_active");
 comicnav.classList.toggle("_active");
});



// ページUP
const PageUpBtn = document.getElementById('js-pageup');

window.addEventListener("scroll", function () {
 const scroll = window.pageYOffset;
 if (scroll > 700) {
  PageUpBtn.style.opacity = 1;
 } else PageUpBtn.style.opacity = 0;
});

PageUpBtn?.addEventListener('click', () => {
 window.scrollTo({
  top: 0,
  behavior: 'smooth'
 });
});

var qs = getQueryStringObject();
var page = qs.p;
var html = qs.h;
var category = qs.c;
var article = qs.a;

if (!page && !html && !article) {
  var url = "https://raw.githubusercontent.com/"+githubUserName+"/"+githubRepoName+"/main/html/main.html"
  fetch(url)
  .then(res => res.text())
  .then((out) => {
    document.querySelector(".mainwrapper").innerHTML += out
  })
} else if (html) {
  var url = "https://raw.githubusercontent.com/"+githubUserName+"/"+githubRepoName+`/main/html/${html}.html`
  fetch(url)
  .then(res => res.text())
  .then((out) => {
    document.querySelector(".mainwrapper").innerHTML += out
  })
} else if (page == 'blog') {
    document.querySelector(".mainwrapper").innerHTML = '<h1 class="novelpage__title titles headingL"></h1><div class="novelpage__inner"><section class="novelpage__main"></section></div>'
    document.querySelector(".novelpage__title").innerHTML = '<i class="las la-chess-queen"></i>Blog'
    if (category) {
        document.querySelector(".novelpage__title").innerText += '/'+category
    } 
    document.querySelector(".novelpage__inner").innerHTML += '<div class="modoru"><a href="./?p=blog">전체보기</a></div>'
    document.querySelector(".novelpage__inner").innerHTML += '<div class="article_list"></div>'
    var url = "https://api.github.com/repos/"+githubUserName+"/"+githubRepoName+"/git/trees/main"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        var resultree1 = JSON.parse(out).tree;
        for (var k=0; k < resultree1.length; k++) {
            if (resultree1[k].path == 'posts') {
                var resulturl1 = resultree1[k].url
                fetch(resulturl1)
                .then(res2 => res2.text())
                .then((out2) => {
                    var resultree2 = JSON.parse(out2).tree;
                    console.log(resultree2)

                    resultree2.sort((a, b) => parseInt(b.path.split('_')[1]) - parseInt(a.path.split('_')[1]));
                    var articles = []
                    var categories = []
                    for (var j=0; j<resultree2.length;j++) {
                        articles.push({
                            title: resultree2[j].path.split('_')[2].split('.')[0],
                            category: resultree2[j].path.split('_')[0],
                            date: resultree2[j].path.split('_')[1]
                        })
                        categories.push(resultree2[j].path.split('_')[0])
                    }

                    console.log(articles)

                    var categorieset = new Set(categories);
                    categories = [...categorieset];
                    for (var j=0; j<categories.length; j++){
                    document.querySelector(".modoru").innerHTML += ' · <a href="./?p=blog&c='+categories[j]+'">'+categories[j] + '</a>'
                    }

                    for (var j=0; j<articles.length; j++){
                        if (articles[j].category == category || !category){
                            document.querySelector(".article_list").innerHTML += '<div class="article"><a href="./?a='+articles[j].category+'_'+articles[j].date+'_'+articles[j].title+'"><span>'+articles[j].title+'</span><span><code>'+articles[j].category+'</code> <code>'+articles[j].date+'</code></span></a></div>'
                        }
                    }
                })
            }
        }
    })
} else if (article) {
    document.querySelector(".mainwrapper").innerHTML = '<h1 class="novelpage__title titles headingL"></h1><div class="novelpage__inner"><section class="novelpage__main"></section></div>'
    var article_category = article.split('_')[0]
    var article_date = article.split('_')[1]
    var article_title = article.split('_')[2].split('.')[0]
    var url = "https://raw.githubusercontent.com/"+githubUserName+"/"+githubRepoName+"/main/posts/"+article+".md"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector(".novelpage__title.titles").innerHTML = '<i class="las la-chess-queen"></i>'+article_title
        document.querySelector(".novelpage__main").innerHTML += '<div class="article_category"></div><div class="article_content"></div>'
        document.querySelector(".article_category").innerHTML = '<a href="./?p=blog&c='+article_category+'">' + article_category+'</a> · '+article_date
        document.querySelector(".article_content").innerHTML += marked.parse(out)
    })
} else if (page) {
  document.querySelector(".mainwrapper").innerHTML = '<h1 class="novelpage__title titles headingL"></h1><div class="novelpage__inner"><section class="novelpage__main"></section></div>'
  var url = "https://raw.githubusercontent.com/"+githubUserName+"/"+githubRepoName+`/main/markdown/${page}.md`
  fetch(url)
  .then(res => res.text())
  .then((out) => {
    out = out.replace('\n', '<titleendhere>')
    var title = out.split('<titleendhere>')[0].replace('# ', '')
    var content = out.split('<titleendhere>')[1]
    document.querySelector(".novelpage__title.titles").innerHTML = '<i class="las la-chess-queen"></i>'+title
    document.querySelector(".novelpage__main").innerHTML += marked.parse(content)
  })
}