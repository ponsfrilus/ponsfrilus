let TOKEN = process.env.GHTOKEN_README || false

if (!TOKEN) {
  console.error('GHTOKEN_README not found')
  process.exit()
}

const me = 'ponsfrilus'
const title = '### Hi there 👋'

const { Octokit } = require("@octokit/core")
const octokit = new Octokit({ auth: TOKEN })

const fs = require('fs')

const _generateREADMEheader = async () => {
  info = await octokit.request('GET /users/{username}', {
    username: me
  })
  let header = `<p align="center">
  <img src="${info.data.avatar_url}" />
  <h3 align="center">
    ${info.data.name} aka ${info.data.login}
  </h3>
  <p align="center">
    ${info.data.bio}
  </p>
</p>`
  return header
}

const _generateStarredRepo = async () => {
  repo = await octokit.request('GET /user/starred', {
    per_page: 10
  })
  let ret = '<h3>My last 10 starred repo</h3>\n<ul>\n'
  repo.data.forEach((item, i) => {
    ret += `<li><a href="${item.html_url}" title="${item.description}" target="_blank">${item.name}</a>&nbsp;<a href="${item.html_url}" title="${item.description}" target="_blank"><img src="https://img.shields.io/github/stars/${item.full_name}?style=social" alt="GitHub"></a></li>`
  })
  ret += '</ul>'
  return ret
}

const _generateLastCommits = async () => {
  commits = await octokit.request('GET /search/commits', {
    q: 'author:ponsfrilus',
    sort: 'author-date',
    order: 'desc',
    per_page: 10,
    mediaType: {
      previews: [
        'cloak'
      ]
    }
  })

  let ret = '<h3>My last 10 commits</h3>\n<ul>\n'
  commits.data.items.forEach((item, i) => {
    ret += `<li><a href="${item.url}" title="${item.commit.author.date}" target="_blank">${item.sha.slice(0,8)}</a>@<a href="${item.repository.owner.url}">${item.repository.owner.login}</a>/<a href="${item.repository.html_url}" title="${item.repository.description}">${item.repository.name}</a><br/>${item.commit.message}</li>`
  })
  ret += '</ul>'
  return ret
}

const init = async () => {
  let content = title
  content += await _generateREADMEheader()
  content += `<table><tr><td>${await _generateLastCommits()}</td><td style="vertical-align:top;width:40%">${await _generateStarredRepo()}</td></tr></table>`
  fs.writeFile("./README.md", content, function(err) {
    if(err) {
      return console.log(err)
    }
  })
}
init()