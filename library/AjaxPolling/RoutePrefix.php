<?php

class AjaxPolling_RoutePrefix implements XenForo_Route_Interface
{
	
	/**
	 * Match the route against our class
	 * 
	 * @param  string                       $routePath 
	 * @param  Zend_Controller_Request_Http $request   
	 * @param  XenForo_Router               $router    
	 * 
	 * @return object
	 */
	public function match($routePath, Zend_Controller_Request_Http $request, XenForo_Router $router)
	{
		$action = $router->resolveActionWithStringParam($routePath, $request, 'action');

		$routeMatch = $router->getRouteMatch('AjaxPolling_ControllerPublic', $action);
		$routeMatch->setResponseType('raw');

		return $routeMatch;
	}

}