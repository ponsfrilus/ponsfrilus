let TOKEN = process.env.GHTOKEN_README || false

if (!TOKEN) {
  console.error('GHTOKEN_README not found')
  process.exit()
}

const me = 'ponsfrilus'
const title = '### Hi there 👋\n'

const { Octokit } = require("@octokit/core")
const octokit = new Octokit({ auth: TOKEN })

const fs = require('fs')

// adapted from https://stackoverflow.com/a/4312956/960623
const monthDiff = (dateFrom, dateTo) => {
  months = dateTo.getMonth() - dateFrom.getMonth() + 
   (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
  return Math.floor(months/12) + ' years and ' + months%12 + ' months';
}

const _generateREADMEheader = async () => {
  info = await octokit.request('GET /users/{username}', {
    username: me
  })
  let header = `\n<p align="center">
  <img src="${info.data.avatar_url}" />
  <h3 align="center">
    ${info.data.name} aka ‟${info.data.login}„
  </h3>
  <p align="center">
    Hello world! I'm a full stack engineer working <a href="https://github.com/epfl-si">${info.data.company}</a> in ${info.data.location}.
    Apparently, I'm hanging around on GitHub since ${monthDiff(new Date(info.data.created_at), new Date())}.
    <br />You can reach me on twitter <a href="https://twitter.com/${info.data.twitter_username}">@${info.data.twitter_username}</a> or <a href="http://linkedin.com/in/nicolasborboen">LinkedIn</a>.
    <br />I'm also a teacher, a bots breeder, a happy husband and father of 2.
  </p>
  <p align="center">
    <a href="https://www.epfl.ch">#EPFL</a> | 
    <a href="https://github.com/epfl-si/">#EPFL-SI</a> | 
    <a href="https://github.com/epfl-idevfsd">#EPFL-IDEVFSD</a> | 
    <a href="https://github.com/topics/epfl-dojo">#EPFL-Dojo</a> | 
    <a href="https://github.com/topics/epfl-dojo-kata">#EPFL-Dojo-kata</a> | 
    <a href="https://en.wikipedia.org/wiki/Indentation_style#Variant:_1TBS_(OTBS)">#1TBS</a>
  </p>
  <p align="center">
    <a href="https://github.com/ponsfrilus"><img alt="GitHub followers" src="https://img.shields.io/github/followers/ponsfrilus?label=Follow%20me%20on%20github&style=social"></a>
    <a href="https://twitter.com/ponsfrilus"><img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/ponsfrilus?label=follow%20me%20on%20twitter&style=social"></a>
  </p>
  </p><hr>`
  return header
}

const _generateLastCommits = async () => {
  commits = await octokit.request('GET /search/commits', {
    q: 'author:ponsfrilus',
    sort: 'author-date',
    order: 'desc',
    per_page: 100,
    mediaType: {
      previews: [
        'cloak'
      ]
    }
  })

  let ret = '\n<table>\n<thead>\n<tr>\n<th>My last commits</th>\n</tr>\n</thead>\n<tr>\n<td valign="top">\n<ul>\n'
  let num = 0
  commits.data.items.every((item, i) => {
    if (item.commit.message != 'README updated by GitHub Actions') {
      num++
      ret += `<li><a href="${item.url}" title="${item.commit.author.date}" target="_blank">${item.sha.slice(0,8)}</a><a href="${item.repository.owner.html_url}">@${item.repository.owner.login}</a><a href="${item.repository.html_url}" title="${item.repository.description}">/${item.repository.name}</a><br/><pre>${item.commit.message}</pre></li>\n`
    }
    if (num >= 10) return false
    else return true
  })
  ret += '</ul>\n</td>\n</tr>\n</table>\n'
  return ret
}

const _generateStarredRepo = async () => {
  repo = await octokit.request('GET /user/starred', {
    per_page: 20
  })
  let ret = '<table>\n<thead>\n<tr>\n<th colspan=2>My last starred repos</th>\n</tr>\n</thead>\n<tr>\n'
  let retA = '\n<td valign="top">\n<ul>\n'
  let retB = '\n<td valign="top">\n<ul>\n'
  repo.data.forEach((item, i) => {
    if (i%2) {
      retB += `<li><a href="${item.html_url}" title="${item.description}" target="_blank">${item.name}</a>&nbsp;<a href="${item.html_url}" title="${item.description}" target="_blank"><img src="https://img.shields.io/github/stars/${item.full_name}?style=social" alt="GitHub"></a></li>\n`
    } else {
      retA += `<li><a href="${item.html_url}" title="${item.description}" target="_blank">${item.name}</a>&nbsp;<a href="${item.html_url}" title="${item.description}" target="_blank"><img src="https://img.shields.io/github/stars/${item.full_name}?style=social" alt="GitHub"></a></li>\n`
    }
  })
  retA += '</ul>\n</td>\n'
  retB += '</ul>\n</td>\n'
  ret += retA + retB + '</td>\n</tr>\n</table>\n'
  return ret
}

const init = async () => {
  let content = title
  content += await _generateREADMEheader()
  content += `${await _generateLastCommits()}`
  content += `${await _generateStarredRepo()}`
  content += `<br><br><small>⏰ Updated on ${new Date().toUTCString()}</small>`
  fs.writeFile("./README.md", content, function(err) {
    if(err) {
      return console.log(err)
    }
  })
}
init()