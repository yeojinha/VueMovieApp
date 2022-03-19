exports.handler = async function (event, context)
{
  return {
    statusCode: 200,
    body: JSON.stringify({
      name:'Yeojin',
      age:30,
      email: "$$$$$$$$@gmail.com"
    })
  }
}