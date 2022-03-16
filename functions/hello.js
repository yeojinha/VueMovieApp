exports.handler = async function (event, context)
{
  return {
    stsusCode: 200,
    body: JSON.stringify({
      name:'Yeojin',
      age: 30,
      email: "hayeojin4966@gmilc.om"
    })
  }
}