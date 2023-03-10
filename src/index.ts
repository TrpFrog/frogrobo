import * as ff from '@google-cloud/functions-framework'
import 'dotenv/config'
import { Bot } from './bot'
import actions from './skills'
import { isAccessAllowed, webhookChallenge } from './auth'

ff.http('FrogRoboFunction', async (req: ff.Request, res: ff.Response) => {
  if (!isAccessAllowed(req)) {
    res.status(401)
    res.send({ error: 'Unauthorized' })
    return
  }

  if (req.method === 'GET') {
    webhookChallenge(req, res)
    return
  } else if (req.method === 'POST') {
    const bot = new Bot()
    if ('general' in req.query) {
      await bot.tweetGenerally()
    } else {
      console.log(req.body)
      actions.forEach(act => { bot.addListener(act) })
      await bot.run(req.body)
    }
  } else {
    res.send({ error: 'Invalid request' })
    return
  }
  res.send({ status: 'OK' })
})
