package mysftp.password_server;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;

import mysftp.rpc_api.PasswordServer;

public class PasswordServerImpl implements PasswordServer {

	@Override
	public int addPass(String pass) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int removePass(String user) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int verifyPass(String user, String pass) {
		// TODO Auto-generated method stub
		return 0;
	}

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String host = args[0] != null ? args[0] : null;
		int port = args[1] != null ? Integer.parseInt(args[1]) : null;
		
		try {
			PasswordServerImpl server = new PasswordServerImpl();
			PasswordServer stub = (PasswordServer)UnicastRemoteObject.exportObject(server, port);
			
			Registry registry = LocateRegistry.getRegistry(host, port);
			registry.bind("PasswordServer", stub);
			
			System.err.println("Password Server ready @ " + host + " : " + port);
		} catch (Exception e) {
			// TODO: handle exception
		}

	}

}
