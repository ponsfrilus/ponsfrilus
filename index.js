let TOKEN = process.env.GHTOKEN_README || false

if (!TOKEN) {
  console.error('GHTOKEN_README not found')
  process.exit()
} else {
  // console.log('Using token:', TOKEN)
}
var github = require('octonode')
var client = github.client(TOKEN)
var ghme = client.me()

// client.get('/user', {}, function (err, status, body, headers) {
//   console.log(body) //json object
// });

function title () {
  return "### Hi there 👋"
}

async function generateREADMEheader (client) {
  info = await ghme.infoAsync()
  myInfo = info[0]
  //console.log(info)
  let header = `
  <p align="center">
    <img src="${myInfo.avatar_url}" />
    <h3 align="center">
    ${myInfo.name} aka ${myInfo.login}
    </h3>
    <p align="center">
      ${myInfo.bio}
    </p>
  </p>`
  return header
}

async function getStarredRepo (client, limit=10) {
  starredRepo = await ghme.starredAsync()
  return starredRepo[0].slice(0, limit)
}
async function getStarredRepoLimitedData () {
  let ret = []
  starredRepo = await getStarredRepo()
  starredRepo.forEach((item, i) => {
    let ro = { 'html_url': item.html_url, 
               'description': item.description,
               'name': item.name,
               'full_name': item.full_name,
               'stargazers_count': item.stargazers_count,
               'watchers_count': item.watchers_count,
               'language': item.language,
               'forks_count': item.forks_count,
               'open_issues_count': item.open_issues_count,
               'watchers': item.watchers,
             }
    ret.push(ro)
  });
  return ret
}
async function starredRepoLi () {
  let ret = '<h3>My last 10 starred repo</h3>\n<ul>\n'
  data = await getStarredRepoLimitedData()
  data.forEach((item, i) => {
    ret += `
  <li>
    <a href="${item.html_url}" title="${item.description}" target="_blank">${item.name}</a>&nbsp;
    <a href="${item.html_url}" title="${item.description}" target="_blank">
      <img src="https://img.shields.io/github/stars/${item.full_name}?style=social" alt="GitHub">
    </a>
  </li>
`
  });
  ret += '</ul>'
  return ret
}
const init = async () => {
  console.log(title())
  header = await generateREADMEheader()
  console.log(header)
  sr = await starredRepoLi();
  console.log(sr)
}

init();


/**
 * [ ] I have been a github user since X years and Y months
 * [ ] 10 last commit 
 * [ ] 10 last project worked on
 * [ ] 10 last pull request
 * [ ] 10 biggest project contributed (stars)
*/
