This is a comparison of Koa, Express, and Hapi for the KualiCo Research projects.

Each implementation utilizes the same front-end, a simple React app that lets the user enter/edit/delete items. Each framework uses the same EJS file as a template to create the initial html page. 

My initial impressions:
* Express is the standard framework for Node/IO.js. It's simple and there is more middleware available for it than other frameworks. It's sponsored by StrongLoop which can be seen as a good or bad thing.
* Koa feels like Express with generators.  So instead of typing ```next();``` you type ```yield next;```.  While that seems like the logic would be easier I didn't find it that helpful.
* Hapi is very interesting. It professes configuration over code, and while that's not the funnest way to implement features... it might be good for us. Also Hapi has the weight of Walmart behind it. Most major bugs have already been discovered and fixed. Many, many requests are served every day by Hapi. On the other hand, Hapi has a larger API to learn and no one is familiar with it.
* The student team is currently using Koa. They also considered Express, but didn't evaluate Hapi. Although Koa isn't as mature as Express their team has a willingness to write missing middleware and spend time hardening the framework.

### Number of npm downloads in the last month
Express  | Koa   | Hapi
---------|-------|--------
2,093,360|23,850 |  98,227
