import {Hono} from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))

export default {
	fetch: app.fetch,
	scheduled: async (batch: any, env: any) => {
		console.log({batch, env})
	}
}
