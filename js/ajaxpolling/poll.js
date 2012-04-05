AjaxPolling = new function()
{

	var base;

	var counters = {
		conversations:	0,
		alerts:			0
	};

	var $this = this;

	var alerted = {};

	var polls = 0;
	
	this.init = function()
	{
		base = $("base").attr("href");
		
		var alertedCookie = $.getCookie('alerted');
		if (alertedCookie != null)
		{
			alerted = JSON.parse(alertedCookie);
		}

		$this.detectUnread();

		setInterval($this.getUnread, 60000);
	};

	this.getUnread = function()
	{
		$.getJSON(base + 'index.php/poll/unread', $this.checkUnread);
	};

	this.checkUnread = function(data)
	{
		if (typeof data != 'object' || data.conversationsUnread === undefined || data.alertCount === undefined)
		{
			return;
		}

		if (data.conversationsUnread != counters.conversations)
		{
			$this.setBalloonCount("Conversations", data.conversationsUnread, "inbox");
			$this.showAlertPopin('Conversations');
		}

		if (data.alertCount != counters.alerts)
		{
			$this.setBalloonCount("Alerts", data.alertCount, "alerts");
			$this.showAlertPopin('Alerts');
		}
	};

	this.detectUnread = function()
	{
		if ($("#ConversationsMenu_Counter").length === 1)
		{
			counters.conversations = $.trim($("#ConversationsMenu_Counter").text());
		}
		if ($("#AlertsMenu_Counter").length === 1)
		{
			counters.alerts = $.trim($("#AlertsMenu_Counter").text());
		}
	};

	this.showAlertPopin = function(name)
	{
		XenForo.ajax(
			base + 'index.php/poll/unread' + name, '',
			function(data)
			{
				if (name == "Alerts")
				{
					$this.showAlerts(data.templateHtml);
				}
				else
				{
					$this.showUnreads(data.templateHtml);
				}
			},
			{ type: 'GET' }
		);
	};

	this.showAlerts = function(html)
	{
		$(html).find("li.Alert").each(function()
		{
			var alertId = $(this).attr("id");

			if ( ! $this.logAlert(alertId))
			{
				return;
			}

			var elem = $("<div>").append($(this).find("h3").clone());
			XenForo.stackAlert(elem , 5000);
		});
	};

	this.showUnreads = function(html)
	{
		$(html).find("li.unread").each(function()
		{
			var unreadId = $(this).find("h3 a.PopupItemLink").attr("href");

			if ( ! $this.logAlert(unreadId))
			{
				return;
			}

			var elem = $("<div>");
			elem.append($(this).find("h3").clone());
			elem.find("h3").prepend("Conversation Updated: ");
			elem.append($(this).find("p.muted").clone());

			XenForo.stackAlert(elem, 5000);
		});
	};

	this.setBalloonCount = function(balloon, count, parent)
	{
		if ($("#"+balloon+"Menu").is(':visible'))
		{
			return false;
		}

		$("#"+balloon+"Menu_Counter").remove();

		if (count > 0)
		{
			$("<strong>").attr({id: balloon + "Menu_Counter", "class": "itemCount"}).text(count).append(
				$("<span>").addClass("arrow")
			).appendTo(".navTab."+parent+" a");
		}

		var PopupMenu	= $("#"+balloon+"Menu_Counter").closest('.Popup').data('XenForo.PopupMenu');
		
		if (PopupMenu !== undefined)
		{
			PopupMenu.resetLoader();
		}

		counters[balloon.toLowerCase()] = count;
	};
	
	this.logAlert = function(id)
	{
		if (alerted[id] !== undefined)
		{
			return false;
		}
		
		alerted[id] = true;
		
		var expires = new Date();
		expires.setDate(expires.getDate() + 7);
		$.setCookie('alerted', JSON.stringify(alerted), expires);
		
		return true;
	};
	
	$(document).ready(this.init);

};

