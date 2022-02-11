const assure = require('../../assure')
const dl = require('../../dl')
const err = require('../../err')

const _parseEp = (_ep) => {
  return {
    title: assure.str(_ep.title, 'title'),

    guests: assure.arr(_ep.guests, 'guests').map((g) => ({
      name: assure.str(p.name, 'guest.name'),
    })),

    images: {
      poster: assure.str(_ep.poster_image_url, 'poster_image_url'),
    },

    tags: {
      premium: assure.bool(ep.premium, 'premium'),
    },

    ctx: {
      playlistUrl: assure.str(_ep.delivery_date, 'streaming_url'),
    },

    onsen: {
      delivery_date: assure.str(_ep.delivery_date, 'delivery_date'),
    },
  }
}

const _parseShow = (raw) => {
  const _shows = assure.arr1(raw, 'shows')
  for (let i = 0; i < _shows.length; i++) {
    const _show = assure.obj(shows[i], 'shows[i]')

    const show = {
      id: assure.str(_show.directory_name, 'directory_name'),
      title: _show.title || '',
      performers: assure.arr(_show.performers, 'performers').map((p) => ({
        name: assure.str(p.name, 'performer.name'),
        onsen: { id: assure.int(p.id, 'performer.id') },
      })),
      eps: [],
    }

    const eps = assure.arr(show.contents, 'contents')
    for (let j = 0; j < eps.length; j++) {
      const _ep = assure.obj(eps[i], 'eps[i]')
      const ep = _parseEp(_ep)
      show.eps.push(ep)
    }
  }

  // missing date, tags.trial
}

module.exports = async () => {
  let bodyText
  try {
    bodyText = await dl.load('https://onsen.ag/web_api/programs/')
  } catch (e) {
    throw err.wrap(err, 'onsen.shows')
  }

  let bodyJSON 
  try {
    bodyJSON = JSON.parse(bodyText)
  } catch (e) {
    throw err.wrap(e, 'onsen.shows', {
      bodyText
    })
  }

  let bodyObj
  try {
    bodyObj = _parse(bodyJSON)
  } catch (e) {
    throw err.wrap(e, 'onsen.show', {
      bodyText,
      bodyJSON,
    })
  }

  return bodyObj
}
/*
const assert = require("assert/strict");
const Episode = require("../../types/Episode");

const Got = require("../Got");
const GOT_PROPS = {
  headers: {
    Referer: "https://www.onsen.ag/",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:56.0) Gecko/20100101 Firefox/56.0",
  },
};

const shows = async () => {
  const got = new Got(GOT_PROPS);
  const text = await got.load("https://onsen.ag/web_api/programs/", null, {});
  const raws = JSON.parse(text);
  return parseShows(raws);
};

const _validateResponse = (raws) => {
  if (!Array.isArray(raws)) throw Error("received raws isn't array");
  for (let i = 0; i < raws.length; i++) {
    const raw = raws[i];
    if (raw.directory_name == null) throw Error("empty directory_name");
    if (!Array.isArray(raw.performers)) throw Error("performers isn't array");
    for (let j = 0; j < raw.performers.length; j++) {
      const p = raw.performers[j];
      if (p.name == null) throw Error("performers doesn't contain names");
    }
    if (!Array.isArray(raw.contents)) throw Error("raw.contents isn't array");
    for (let j = 0; j < raw.contents.length; j++) {
      const ep = raw.contents[j];
      if (!Array.isArray(ep.guests)) throw Error("guests isn't array");
      for (let k = 0; k < ep.guests.length; k++) {
        const g = ep.guests[j];
        if (g.name == null) throw Error("guests doesn't contain names");
      }
    }
  }
};

const parseShows = (raws) => {
  let result = [];

  assure(raws, [{
    directory_name: 'string', 
    performers: [{name: 'string'}]
    contents: [{
      guests: [{name: 'string'}]
    }]
  }])

  for (let i = 0; i < raws.length; i++) {
    const raw = raws[i];
    const showId = raw.directory_name;
    const showTitle = raw.title || "";
    const performers = raw.performers.map((p) => p.name);
    const today = new Date();

    for (let j = 0; j < raw.contents.length; j++) {
      const ep = raw.contents[j];
      const title = ep.title || "";

      const guests = ep.guests.map((e) => {
        return e.name;
      });
      const imageUrl = ep.poster_image_url || "";

      let date = "000000";
      if (ep.delivery_date != null) {
        let year = +today.slice(0, 2);
        let info = String(ep.delivery_date)
          .split("/")
          .map((e) => parseInt(e));
        try {
          assert(1 <= info[0] && info[0] <= 12);
          assert(1 <= info[1] && info[1] <= 31);
          assert(info.length === 2);
        } catch (e) {
          console.log("date:" + ep.delivery_date);
          console.error("wrong date");
          throw Error("wrong delivery_date");
        }

        date = new Date(year, info[0] - 1, info[1]);
        if (+date > +today) {
          date = new Date(year - 1, info[0] - 1, info[1]);
        }
      }

      const isTrial = title.indexOf("予告") !== -1;
      const playlistUrl = ep.streaming_url;

      result.push(
        new Episode({
          provider: "onsen",
          date,
          showId: showId,
          showTitle: showTitle,
          title: title,
          performers: performers,
          guests: guests,
          tags: {
            premium: ep.premium,
            trial: isTrial,
          },
          imageUrl: imageUrl,
          hooks: {},
          playlistUrl,
        })
      );
    }
  }
  return result;
};

module.exports = {
  shows,
  parseShows,
  GOT_PROPS,
};

*/