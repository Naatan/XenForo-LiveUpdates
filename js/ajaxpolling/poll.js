var AjaxPolling = new function()
{

	var base;

	var counters = {
		conversations:	0,
		alerts:			0
	};

	var $this = this;
	
	this.init = function()
	{
		base = $("base").attr("href");

		$this.detectUnread();

		setInterval($this.getUnread, 60000);
	};

	this.getUnread = function()
	{
		$.getJSON(base + 'poll/unread', $this.checkUnread);
	};

	this.checkUnread = function(data)
	{
		if (typeof data != 'object' || data.conversationsUnread === undefined || data.alertCount === undefined)
		{
			return;
		}

		if (data.conversationsUnread != counters.conversations)
		{
			$this.setConversationsUnread(data.conversationsUnread);
		}

		if (data.alertCount != counters.alerts)
		{
			$this.setAlertCount(data.alertCount);
		}
	};

	this.detectUnread = function()
	{
		if ($("#ConversationsMenu_Counter").length === 1)
		{
			counters.conversations = $("#ConversationsMenu_Counter").text().trim();
		}
		if ($("#AlertsMenu_Counter").length === 1)
		{
			counters.alerts = $("#AlertsMenu_Counter").text().trim();
		}
	};

	this.setConversationsUnread = function(count)
	{
		return $this.setBalloonCount("Conversations", count, "inbox");
	};

	this.setAlertCount = function(count)
	{
		return $this.setBalloonCount("Alerts", count, "alerts");
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
		PopupMenu.resetLoader();

		counters[balloon.toLowerCase()] = count;
	};

	$(document).ready(this.init);

};

