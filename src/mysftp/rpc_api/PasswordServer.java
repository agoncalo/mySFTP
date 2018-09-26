package mysftp.rpc_api;

import java.rmi.Remote;

public interface PasswordServer extends Remote {
	public int addPass(String pass);
	public int removePass(String user);
	public int verifyPass(String user, String pass);
}
