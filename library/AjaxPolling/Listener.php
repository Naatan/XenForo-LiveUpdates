<?php

class AjaxPolling_Listener
{

	static $addJs = true;
	
	/**
	 * Singleton class, no constructor
	 */
	private final function __construct() {}

	/**
	 * Hook into template_create to add JS dependencies
	 * 
	 * @param  string					$templateName 
	 * @param  array					&$params	  
	 * @param  XenForo_Template_Abstract $template	 
	 * 
	 * @return void
	 */
	public static function template_create($templateName, array &$params, XenForo_Template_Abstract $template) 
	{
		if ( ! self::$addJs || class_exists('XenForo_Dependencies_Admin', false))
		{
			return;
		}

		$template->addRequiredExternal('js','js/ajaxpolling/poll.js');
	}

}