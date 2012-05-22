<?php

class LiveUpdate_Route_Prefix_LiveUpdate implements XenForo_Route_Interface
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
		return $router->getRouteMatch('LiveUpdate_ControllerPublic_Update', $routePath);
	}

}