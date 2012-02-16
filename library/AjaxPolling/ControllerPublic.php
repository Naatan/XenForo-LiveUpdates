<?php

class AjaxPolling_ControllerPublic extends XenForo_ControllerPublic_Abstract 
{

	/**
	 * Force raw response type so we can dump our own JSON data
	 * 
	 * @return string
	 */
	public function getResponseType() 
	{
		return 'raw';
	}

	/**
	 * Receive unread items
	 * 
	 * @return XenForo_ControllerResponse_View
	 */
	public function actionUnread()
	{
		$visitor = XenForo_Visitor::getInstance();

		echo json_encode(array(
			'conversationsUnread' 	=> XenForo_Locale::numberFormat($visitor->conversations_unread),
			'alertCount'			=> XenForo_Locale::numberFormat($visitor->alerts_unread)
		));

		return new XenForo_ControllerResponse_View( '' );
	}
}