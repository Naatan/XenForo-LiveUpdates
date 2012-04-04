var AjaxPolling = new function()
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
			$this.reloadMenu('inbox');
		}

		if (data.alertCount != counters.alerts)
		{
			$this.setBalloonCount("Alerts", data.alertCount, "alerts");
			$this.reloadMenu('alerts');
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

	this.reloadMenu = function(className)
	{
		var menu = $("."+className+".Popup").data("XenForo.PopupMenu");
		menu.resetLoader();

		menu.loading = XenForo.ajax(
			menu.contentSrc, '',
			function(data) {
				menu.loadSuccess(data);
				menu.$control.addClass('PopupClosed').removeClass('PopupOpen');

				if (className == "alerts")
				{
					$this.showAlerts(menu);
				}
				else
				{
					$this.showUnreads(menu);
				}
			},
			{ type: 'GET' }
		);

		menu.$menu.find('.Progress').addClass('InProgress');
	};

	this.showAlerts = function(menu, preload)
	{
		menu.$menu.find("li.Alert").each(function()
		{
			var alertId = $(this).attr("id");

			if (alerted[alertId] !== undefined)
			{
				return;
			}

			alerted[alertId] = true;

			if (preload === undefined)
			{
				var elem = $("<div>").append($(this).find("h3").clone());

				XenForo.stackAlert(elem , 5000);
			}
		});
	};

	this.showUnreads = function(menu, preload)
	{
		menu.$menu.find("li.unread").each(function()
		{
			var unreadId = $(this).find("h3 a.PopupItemLink").attr("href");

			if (alerted[unreadId] !== undefined)
			{
				return;
			}

			alerted[unreadId] = true;

			if (preload === undefined)
			{
				var elem = $("<div>");
				elem.append($(this).find("h3").clone());
				elem.find("h3").prepend("Conversation Updated: ");
				elem.append($(this).find("p.muted").clone());

				XenForo.stackAlert(elem, 5000);
			}
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

	$(document).ready(this.init);

};

