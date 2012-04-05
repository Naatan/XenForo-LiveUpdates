<?php

class AjaxPolling_ControllerPublic extends XenForo_ControllerPublic_Abstract 
{

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
		
		$this->_routeMatch->setResponseType('raw');
		return new XenForo_ControllerResponse_View( '' );
	}
	
	public function actionUnreadAlerts()
	{
		$alertModel = new XenForo_Model_Alert;
		$visitor = XenForo_Visitor::getInstance();

		$alertResults = $alertModel->getAlertsForUser(
			$visitor['user_id'],
			XenForo_Model_Alert::FETCH_MODE_POPUP
		);

		$alertsRead = array();
		$alertsUnread = array();
		foreach ($alertResults['alerts'] AS $alertId => $alert)
		{
			if ($alert['unviewed'])
			{
				$alertsUnread[$alertId] = $alert;
			}
		}
		
		$viewParams = array(
			'alertsUnread' => $alertsUnread,
			'alertsRead' => $alertsRead,
			'alertHandlers' => $alertResults['alertHandlers'],
		);

		return $this->responseView(
			'XenForo_ViewPublic_Account_AlertsPopup',
			'account_alerts_popup',
			$viewParams
		);
	}
	
	public function actionUnreadConversations()
	{
		$visitor = XenForo_Visitor::getInstance();
		$conversationModel = new XenForo_Model_Conversation;

		$maxDisplay = 10;

		$conversationsUnread = $conversationModel->getConversationsForUser($visitor['user_id'],
			array('is_unread' => true),
			array(
				'join' => XenForo_Model_Conversation::FETCH_LAST_MESSAGE_AVATAR,
				'limit' => $maxDisplay
			)
		);

		$conversationsRead = array();

		$viewParams = array(
			'conversationsUnread' => $conversationModel->prepareConversations($conversationsUnread),
			'conversationsRead' => $conversationModel->prepareConversations($conversationsRead)
		);

		return $this->responseView(
			'XenForo_ViewPublic_Conversation_ListPopup',
			'conversation_list_popup',
			$viewParams
		);
	}
}