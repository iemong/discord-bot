import {HTTPException} from "hono/http-exception";
import {parseFeed} from "htmlparser2";
import {RSSItem} from "../types/rss";

export const fetchItemsFromRSS = async (url: string): Promise<RSSItem[]> => {
	const response = await fetch(url)

	if (!response.ok) {
		throw new HTTPException(500, {message: 'Failed to fetch'})
	}

	const htmlString = await response.text()
	const feed = parseFeed(htmlString)

	if (!feed) {
		throw new HTTPException(500, {message: 'Failed to parse feed'})
	}

	return feed.items.map((item) => ({
		title: item.title,
		link: item.link,
		pubDate: item.pubDate
	}))
}
