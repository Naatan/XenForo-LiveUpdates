<?php

class LiveUpdate_Listener
{
	protected static $_addOption = false;

	public static function templateCreate($templateName, array &$params, XenForo_Template_Abstract $template)
	{
		if ($templateName == 'PAGE_CONTAINER' && $template instanceof XenForo_Template_Public && XenForo_Visitor::getUserId())
		{
			self::$_addOption = true;
			$template->addRequiredExternal('js','js/live-update/update.js');
		}
	}

	public static function templatePostRender($templateName, &$content, array &$containerData, XenForo_Template_Abstract $template)
	{
		if ($templateName == 'PAGE_CONTAINER' && self::$_addOption)
		{
			$content = str_replace(
				'</body>', 
				"<script> $('html').data('pollinterval', " . XenForo_Application::get('options')->liveUpdateInterval . "); </script>\n</body>",
				$content);
		}
	}
}