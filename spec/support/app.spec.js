var Request = require("request");


describe("Server", ()=>{
	var server;
	beforeAll(()=>{
		server = require("./../../app")
	} )

	afterAll(()=>{
		server.close();
	})

	describe("User Register Success case", ()=>{
		var data = {};
		beforeAll((done)=>{

			let options = {
			    url : "http://localhost:3000/register",
				method :"POST",
				headers : {
					'content-type': 'application/x-www-form-urlencoded'
				},
				form: {
					username:"abcd1",
					password:"pass12341",
					firstname:"abcd1",
					lastname:"xyz1",
					email:"abcd11@mail.com",
				}
			}
			Request.post(options, (error, response, body)=>{
				console.log("111111111111")
				console.log("response", response.statusCode)
				console.log("response", response.error)
				console.log("response message", JSON.stringify(response))
				data.status = response.statusCode
				data.body = response.message;
				done()
			})	
		})

		it ("Response status should be 200", ()=>{
			expect(data.status).toBe(200)
		})
		
	})

	describe("Page Not found error", ()=>{
		var data = {};
		beforeAll((done)=>{

			let options = {
			    url : "http://localhost:3000/test",
				method :"POST",
				headers : {
					'content-type': 'application/x-www-form-urlencoded'
				},
				form: {
					username:"abcd1",
					password:"pass12341",
					firstname:"abcd1",
					lastname:"xyz1",
					email:"abcd11@mail.com",
				}
			}
			Request.post(options, (error, response, body)=>{				
				data.status = response.statusCode
				data.body = response.message;
				done()
			})	
		})

		it ("Response status should be 404", ()=>{
			expect(data.status).toBe(404)
		})
		
	})
})
