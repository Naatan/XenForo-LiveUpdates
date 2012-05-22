<?php

class LiveUpdate_ControllerPublic_Update extends XenForo_ControllerPublic_Abstract
{
	public function actionIndex()
	{
		return $this->responseView('LiveUpdate_ViewPublic_Update', '');
	}
}