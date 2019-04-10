const Git = require('nodegit')

/* Initialize a folder with a commit */
const initFolder = async path => {
  const repo = await Git.Repository.init(path)
  return repo
}

/* Open a folder */
const openFolder = async path => {
  const repo = await Git.Repository.open(path)
  return repo
}

/* Stage changes */
const stage = async repo => {
  const index = await repo.index()
  await index.addAll()
  // sync
  await index.write()
  const oid = await index.writeTree()
  return oid
}

/* Create a commit with a message */
const commit = (repo, oid, name, email, message) => {
  const tree = await repo.getTree(oid)
  const latestCommit = await repo.getHeadCommit()
  // We are using the same signature for author and commiter
  const signature = Git.Signature.now(name, email)
  const oid = await repo.createCommit('HEAD', signature, signature, message, oid, [latestCommit.id()])
  return oid
}

/* Create a tag with a message */
const tag = (repo, oid, tagName, message) => {
  const tag = await repo.createTag(oid, tagName, message)
  return tag
}

/* Retrieve a history */
const history = (repo, branch, length) => {
  const latestCommit =  await repo.getBranchCommit()
  const walker = repo.createRevWalk()
  walker.push(commit.id())
  walker.sorting(Git.Revwalk.SORT.TIME)
  const history = await walker.getCommits(options[length])
  return history.map(commit => {
    const author = commit.author()
    const sha = commit.sha()

    return {
      'commit': sha,
      'author': {
        'name': author.name(),
        'email': author.email()
      },
      'date': commit.date(),
      'message': commit.message().trim()
    }
  })
}

/* Restore a specific version */
const restore = (repo, oid) => {
  const commit = Git.Commit.lookup(repo, oid)
  await Git.Checkout.tree(repo, commit, {checkoutStrategy: Git.Checkout.STRATEGY.SAFE})
  return repo.setHeadDetached(commit, repo.defaultSignature, 'Restore: version ' + commit.id())
}

/* Check if given folder is initialized */
const isInitialized = path => {

}

/* Retrieve a number of commits */
const historyLength = () => {

}
