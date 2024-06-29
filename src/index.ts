import {Hono} from 'hono'
import {HTTPException} from "hono/http-exception";
import {fetchItemsFromRSS} from "./lib/fetch";
import {RSSList} from "./lib/RSSList";

type Bindings = {
	WEBHOOK_ENDPOINT: string
}

const app = new Hono<{ Bindings: Bindings }>()


app.get('/', async (c) => {
	const items = await fetchItemsFromRSS(RSSList.get('jser.info')!)

	if (items.length === 0) {
		throw new HTTPException(500, {message: 'No items found'})
	}

	return c.json(items)
})


app.post('/', async (c) => {
	const res = await fetch(c.env.WEBHOOK_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			content: 'Hello, Discord!'
		})
	})

	if (!res.ok) {
		throw new HTTPException(500, {message: 'Failed to send message'})
	}

	return c.json({message: 'Message sent'})
})


export default {
	fetch: app.fetch,
	scheduled: async (batch: any, env: any) => {
		console.log({batch, env})
	}
}
