module.exports = async function () {

  var req = this.req;
  var res = this.res;

  const { WebhookClient } = require('dialogflow-fulfillment');
  // const {Card, Suggestion} = require('dialogflow-fulfillment');

  const agent = new WebhookClient({ request: req, response: res });

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  async function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  // get the price via the general option id and specific option id
  async function checking(agent) {
    let conv = agent.conv();
    let params = agent.parameters;

    const surgeryName = conv.contexts.get('userprovidesurgery-followup').parameters.surgery.original;
    console.log(surgeryName);

    agent.add(conv);
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('User case confirm', checking);
  agent.handleRequest(intentMap)
 
  return res.ok();
}
